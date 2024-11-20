--  Thêm câu lệnh INSERT vào đây
INSERT INTO "user" (email, password, role, status) VALUES ('admin@lms.tech', '$2b$10$dT.0WdP8.5nAp/0nqF/QuO8w9n5pXLJIV/Mo6J7UTQxoS05mAZEui', 'ADMIN', 'ACTIVE');

INSERT INTO "token" (user_id, refresh_otp, reset_otp) VALUES (1, NULL, NULL);
