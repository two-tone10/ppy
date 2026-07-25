alter table fieldbook_moments add column if not exists magnitude numeric check (magnitude >= 0 and magnitude <= 10);
