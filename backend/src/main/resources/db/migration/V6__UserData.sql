INSERT INTO users (username, password, role, email, registration_date) VALUES ('admin', '$2y$12$GgST8JNR88xhu9ARG3zxK.1K2TmBCoCG6NPJXmGDrC24.Yn4c77KG',
                                                                 'ADMIN', 'admin@gmail.com', current_date) ON CONFLICT DO NOTHING;

INSERT INTO users (username, password, role, email, registration_date) VALUES ('user1', '$2y$12$OWd/BZgEPQWaR1WvbuDSb.wRcNGokB4EFzyrMd6vOUyirigbe.pU6',
                                                                 'USER', 'user1@gmail.com', current_date) ON CONFLICT DO NOTHING;

INSERT INTO users (username, password, role, email, registration_date) VALUES ('user2', '$2y$12$OWd/BZgEPQWaR1WvbuDSb.wRcNGokB4EFzyrMd6vOUyirigbe.pU6',
                                                                 'USER', 'user2@gmail.com', current_date) ON CONFLICT DO NOTHING;

INSERT INTO users (username, password, role, email, registration_date) VALUES ('user3', '$2y$12$OWd/BZgEPQWaR1WvbuDSb.wRcNGokB4EFzyrMd6vOUyirigbe.pU6',
                                                                 'USER', 'user3@gmail.com', current_date) ON CONFLICT DO NOTHING;

INSERT INTO users (username, password, role, email, registration_date) VALUES ('user4', '$2y$12$OWd/BZgEPQWaR1WvbuDSb.wRcNGokB4EFzyrMd6vOUyirigbe.pU6',
                                                                 'USER', 'user4@gmail.com', current_date) ON CONFLICT DO NOTHING;

INSERT INTO users (username, password, role, email, registration_date) VALUES ('user5', '$2y$12$OWd/BZgEPQWaR1WvbuDSb.wRcNGokB4EFzyrMd6vOUyirigbe.pU6',
                                                                 'USER', 'user5@gmail.com', current_date) ON CONFLICT DO NOTHING;

INSERT INTO users (username, password, role, email, registration_date) VALUES ('user6', '$2y$12$OWd/BZgEPQWaR1WvbuDSb.wRcNGokB4EFzyrMd6vOUyirigbe.pU6',
                                                                               'USER', 'user6@gmail.com', current_date) ON CONFLICT DO NOTHING;

INSERT INTO users (username, password, firstname, lastname, birthdate, gender, role, email, registration_date)
VALUES ('user7', '$2y$12$OWd/BZgEPQWaR1WvbuDSb.wRcNGokB4EFzyrMd6vOUyirigbe.pU6', 'Nikita', 'Pogodaev', date '18-01-2001',
        0, 'USER', 'user7@gmail.com', current_date) ON CONFLICT DO NOTHING;