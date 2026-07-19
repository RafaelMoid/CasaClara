<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$path = preg_replace('#^casaclara/api/?#', '', $path);
$path = preg_replace('#^api/?#', '', $path);

try {
    if ($method === 'GET' && $path === 'health') {
        respond(['ok' => true, 'service' => 'Casa Clara API']);
    }

    if ($method === 'GET' && $path === 'auth/csrf') {
        respond(['csrfToken' => csrf_token()]);
    }

    if ($method === 'POST' && $path === 'auth/register') {
        require_csrf();
        $data = json_input();
        $name = trim((string) ($data['name'] ?? ''));
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');
        $familyName = trim((string) ($data['familyName'] ?? 'Minha Familia'));

        if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 8) {
            fail('Name, valid email and password with at least 8 characters are required.');
        }

        $pdo = db();
        $pdo->beginTransaction();

        $userId = uuid();
        $familyId = uuid();
        $hash = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)');
        $stmt->execute([$userId, $name, $email, $hash]);

        $stmt = $pdo->prepare('INSERT INTO families (id, name, owner_id) VALUES (?, ?, ?)');
        $stmt->execute([$familyId, $familyName, $userId]);

        $stmt = $pdo->prepare('INSERT INTO family_members (id, family_id, user_id, role) VALUES (?, ?, ?, ?)');
        $stmt->execute([uuid(), $familyId, $userId, 'owner']);

        $pdo->commit();

        session_regenerate_id(true);
        $_SESSION['user_id'] = $userId;
        csrf_token();

        respond(['user' => ['id' => $userId, 'name' => $name, 'email' => $email], 'activeFamilyId' => $familyId], 201);
    }

    if ($method === 'POST' && $path === 'auth/login') {
        require_csrf();
        $data = json_input();
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');

        $stmt = db()->prepare('SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            fail('Invalid email or password.', 401);
        }

        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id'];
        csrf_token();

        unset($user['password_hash']);
        respond(['user' => $user]);
    }

    if ($method === 'POST' && $path === 'auth/logout') {
        require_csrf();
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', $params['secure'], $params['httponly']);
        }
        session_destroy();
        respond(['ok' => true]);
    }

    if ($method === 'GET' && $path === 'auth/me') {
        $user = require_user();
        respond(['user' => $user]);
    }

    if ($method === 'GET' && $path === 'families') {
        $user = require_user();
        $stmt = db()->prepare(
            'SELECT f.id, f.name, f.owner_id, fm.role
             FROM families f
             INNER JOIN family_members fm ON fm.family_id = f.id
             WHERE fm.user_id = ?
             ORDER BY f.created_at ASC'
        );
        $stmt->execute([$user['id']]);
        respond(['families' => $stmt->fetchAll()]);
    }

    if ($method === 'POST' && $path === 'families') {
        require_csrf();
        $user = require_user();
        $data = json_input();
        $name = trim((string) ($data['name'] ?? ''));
        if ($name === '') {
            fail('Family name is required.');
        }

        $pdo = db();
        $familyId = uuid();
        $pdo->beginTransaction();
        $stmt = $pdo->prepare('INSERT INTO families (id, name, owner_id) VALUES (?, ?, ?)');
        $stmt->execute([$familyId, $name, $user['id']]);
        $stmt = $pdo->prepare('INSERT INTO family_members (id, family_id, user_id, role) VALUES (?, ?, ?, ?)');
        $stmt->execute([uuid(), $familyId, $user['id'], 'owner']);
        $pdo->commit();

        respond(['family' => ['id' => $familyId, 'name' => $name, 'owner_id' => $user['id'], 'role' => 'owner']], 201);
    }

    if ($method === 'POST' && $path === 'families/invite') {
        require_csrf();
        $user = require_user();
        $data = json_input();
        $familyId = (string) ($data['familyId'] ?? '');
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $name = trim((string) ($data['name'] ?? ''));

        if ($familyId === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            fail('Family and valid email are required.');
        }

        require_family_owner($familyId, $user['id']);

        $token = bin2hex(random_bytes(24));
        $stmt = db()->prepare('INSERT INTO family_invitations (id, family_id, invited_by, name, email, token) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([uuid(), $familyId, $user['id'], $name, $email, $token]);

        respond(['invitationToken' => $token], 201);
    }

    if ($method === 'POST' && $path === 'invitations/accept') {
        require_csrf();
        $user = require_user();
        $data = json_input();
        $token = (string) ($data['token'] ?? '');

        $stmt = db()->prepare('SELECT * FROM family_invitations WHERE token = ? AND status = ? LIMIT 1');
        $stmt->execute([$token, 'pending']);
        $invitation = $stmt->fetch();

        if (!$invitation || strtolower($invitation['email']) !== strtolower($user['email'])) {
            fail('Invitation not found.', 404);
        }

        $pdo = db();
        $pdo->beginTransaction();
        $stmt = $pdo->prepare('INSERT IGNORE INTO family_members (id, family_id, user_id, role) VALUES (?, ?, ?, ?)');
        $stmt->execute([uuid(), $invitation['family_id'], $user['id'], 'member']);
        $stmt = $pdo->prepare('UPDATE family_invitations SET status = ?, accepted_user_id = ?, accepted_at = NOW() WHERE id = ?');
        $stmt->execute(['accepted', $user['id'], $invitation['id']]);
        $pdo->commit();

        respond(['ok' => true, 'familyId' => $invitation['family_id']]);
    }

    if ($method === 'GET' && $path === 'sync') {
        $user = require_user();
        $familyId = (string) ($_GET['familyId'] ?? '');
        require_family_member($familyId, $user['id']);

        $stmt = db()->prepare('SELECT payload, updated_at FROM app_snapshots WHERE family_id = ? LIMIT 1');
        $stmt->execute([$familyId]);
        $snapshot = $stmt->fetch();

        respond(['snapshot' => $snapshot ? json_decode($snapshot['payload'], true) : null, 'updatedAt' => $snapshot['updated_at'] ?? null]);
    }

    if ($method === 'PUT' && $path === 'sync') {
        require_csrf();
        $user = require_user();
        $data = json_input();
        $familyId = (string) ($data['familyId'] ?? '');
        $payload = $data['payload'] ?? null;

        require_family_member($familyId, $user['id']);
        if (!is_array($payload)) {
            fail('Valid payload is required.');
        }

        $json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $stmt = db()->prepare(
            'INSERT INTO app_snapshots (family_id, payload, updated_by)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE payload = VALUES(payload), updated_by = VALUES(updated_by), updated_at = NOW()'
        );
        $stmt->execute([$familyId, $json, $user['id']]);

        respond(['ok' => true]);
    }

    fail('Route not found.', 404);
} catch (PDOException $exception) {
    fail('Database error.', 500);
} catch (Throwable $exception) {
    fail('Unexpected server error.', 500);
}
