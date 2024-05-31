
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    nickname TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar TEXT DEFAULT(
        'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
    ),
    created_at TEXT DEFAULT(DATETIME('now', '-3 hours')) NOT NULL
);

INSERT INTO
    users (
        id,
        nickname,
        email,
        password,
        role,
        avatar
    )
VALUES
    -- tipo NORMAL e senha = fulano123
    (
        'u001',
        'Fulano',
        'fulano@email.com',
        '$2a$12$qPQj5Lm1dQK2auALLTC0dOWedtr/Th.aSFf3.pdK5jCmYelFrYadC',
        'NORMAL',
        'https://api.dicebear.com/6.x/adventurer/svg?seed=Bandit&scale=10'
    ),
-- tipo ADMIN e senha = astrodev99
    (
    'u003',
    'Astrodev',
    'astrodev@email.com',
    '$2a$12$lHyD.hKs3JDGu2nIbBrxYujrnfIX5RW5oq/B41HCKf7TSaq9RgqJ.',
    'ADMIN',
    'https://api.dicebear.com/6.x/bottts-neutral/svg?seed=Precious&scale=10'
    );

    CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL,
    dislikes INTEGER DEFAULT(0) NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', '-3 hours')) NOT NULL,
    updated_at TEXT DEFAULT(DATETIME('now', '-3 hours')) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE
);

    CREATE TABLE likes_dislikes_posts (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE comments (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL,
    dislikes INTEGER DEFAULT(0) NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', '-3 hours')) NOT NULL,
    updated_at TEXT DEFAULT(DATETIME('now', '-3 hours')) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE FOREIGN KEY (post_id) REFERENCES posts (id) ON UPDATE CASCADE ON DELETE CASCADE
);

    CREATE TABLE likes_dislikes_comments (
    user_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments (id) ON UPDATE CASCADE ON DELETE CASCADE
);