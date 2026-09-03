-- RLS enabled di profiles_siswa/profiles_guru tapi belum ada policy INSERT,
-- jadi signup gagal pas insert baris profil sendiri.

create policy "profil siswa: insert milik sendiri"
  on profiles_siswa for insert
  with check (auth.uid() = id);

create policy "profil guru: insert milik sendiri"
  on profiles_guru for insert
  with check (auth.uid() = id);
