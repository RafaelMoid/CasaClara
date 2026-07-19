CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE families (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  owner_id CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_families_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE family_members (
  id CHAR(36) PRIMARY KEY,
  family_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  role ENUM('owner', 'member') NOT NULL DEFAULT 'member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_family_user (family_id, user_id),
  CONSTRAINT fk_members_family FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  CONSTRAINT fk_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE family_invitations (
  id CHAR(36) PRIMARY KEY,
  family_id CHAR(36) NOT NULL,
  invited_by CHAR(36) NOT NULL,
  accepted_user_id CHAR(36) NULL,
  name VARCHAR(120) NULL,
  email VARCHAR(190) NOT NULL,
  token CHAR(48) NOT NULL UNIQUE,
  status ENUM('pending', 'accepted', 'revoked') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP NULL,
  CONSTRAINT fk_invites_family FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  CONSTRAINT fk_invites_inviter FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_invites_accepted_user FOREIGN KEY (accepted_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE app_snapshots (
  family_id CHAR(36) PRIMARY KEY,
  payload LONGTEXT NOT NULL,
  updated_by CHAR(36) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_snapshots_family FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  CONSTRAINT fk_snapshots_user FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
