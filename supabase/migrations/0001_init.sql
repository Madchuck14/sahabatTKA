-- HaloGuru initial schema

create type jenjang_type as enum ('SD', 'SMP', 'SMA', 'SMK');

create table profiles_siswa (
  id uuid primary key references auth.users (id) on delete cascade,
  nama text not null,
  umur int,
  alamat text,
  jenjang jenjang_type not null,
  kelas text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table profiles_guru (
  id uuid primary key references auth.users (id) on delete cascade,
  nama text not null,
  gelar text,
  umur int,
  alamat text,
  jenjang jenjang_type not null, -- jenjang yang diajar
  rating_avg numeric(2, 1) default 0,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table subjects (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  jenjang jenjang_type not null
);

create table guru_subjects (
  guru_id uuid not null references profiles_guru (id) on delete cascade,
  subject_id uuid not null references subjects (id) on delete cascade,
  primary key (guru_id, subject_id)
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  guru_id uuid not null references profiles_guru (id) on delete cascade,
  siswa_id uuid not null references profiles_siswa (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  komentar text,
  created_at timestamptz not null default now()
);

create table chat_rooms (
  id uuid primary key default gen_random_uuid(),
  siswa_id uuid not null references profiles_siswa (id) on delete cascade,
  guru_id uuid not null references profiles_guru (id) on delete cascade,
  subject_id uuid references subjects (id),
  created_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references chat_rooms (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  content text,
  image_url text,
  created_at timestamptz not null default now()
);

-- Trigger: recompute rating_avg on profiles_guru after review insert/update/delete
create or replace function update_guru_rating_avg()
returns trigger as $$
begin
  update profiles_guru
  set rating_avg = coalesce(
    (select round(avg(rating)::numeric, 1) from reviews where guru_id = coalesce(new.guru_id, old.guru_id)),
    0
  )
  where id = coalesce(new.guru_id, old.guru_id);
  return null;
end;
$$ language plpgsql;

create trigger trg_update_guru_rating_avg
after insert or update or delete on reviews
for each row execute function update_guru_rating_avg();

-- RLS
alter table chat_rooms enable row level security;
alter table messages enable row level security;
alter table profiles_siswa enable row level security;
alter table profiles_guru enable row level security;
alter table reviews enable row level security;

create policy "siswa/guru lihat room miliknya"
  on chat_rooms for select
  using (auth.uid() = siswa_id or auth.uid() = guru_id);

create policy "siswa buat room baru"
  on chat_rooms for insert
  with check (auth.uid() = siswa_id);

create policy "anggota room lihat pesan"
  on messages for select
  using (
    exists (
      select 1 from chat_rooms
      where chat_rooms.id = messages.room_id
      and (chat_rooms.siswa_id = auth.uid() or chat_rooms.guru_id = auth.uid())
    )
  );

create policy "anggota room kirim pesan"
  on messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from chat_rooms
      where chat_rooms.id = messages.room_id
      and (chat_rooms.siswa_id = auth.uid() or chat_rooms.guru_id = auth.uid())
    )
  );

create policy "profil siswa: publik select"
  on profiles_siswa for select using (true);

create policy "profil siswa: update milik sendiri"
  on profiles_siswa for update using (auth.uid() = id);

create policy "profil guru: publik select"
  on profiles_guru for select using (true);

create policy "profil guru: update milik sendiri"
  on profiles_guru for update using (auth.uid() = id);

create policy "review: publik select"
  on reviews for select using (true);

create policy "review: siswa insert milik sendiri"
  on reviews for insert with check (auth.uid() = siswa_id);

-- Storage bucket untuk foto profil (siswa & guru)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatar: publik select"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatar: user upload folder sendiri"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatar: user update file sendiri"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatar: user hapus file sendiri"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Seed subjects
insert into subjects (nama, jenjang) values
  ('Bahasa Indonesia', 'SD'),
  ('Matematika', 'SD'),
  ('Bahasa Indonesia', 'SMP'),
  ('Matematika', 'SMP'),
  ('Fisika', 'SMA'),
  ('Biologi', 'SMA'),
  ('Kimia', 'SMA'),
  ('Matematika Tingkat Lanjut', 'SMA'),
  ('Matematika Wajib', 'SMA'),
  ('Matematika Wajib', 'SMK'),
  ('Bahasa Indonesia', 'SMK'),
  ('Bahasa Inggris', 'SMK');
