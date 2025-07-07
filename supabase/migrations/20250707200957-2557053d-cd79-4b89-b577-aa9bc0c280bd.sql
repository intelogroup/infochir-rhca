-- Store the OpenAI API key securely
INSERT INTO vault.secrets (name, secret) 
VALUES ('OPENAI_API_KEY', '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')
ON CONFLICT (name) DO UPDATE SET secret = EXCLUDED.secret;