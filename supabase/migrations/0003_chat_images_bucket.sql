-- Storage bucket untuk lampiran gambar chat (siswa & guru)
insert into storage.buckets (id, name, public)
values ('chat-images', 'chat-images', true)
on conflict (id) do nothing;

create policy "chat image: publik select"
  on storage.objects for select
  using (bucket_id = 'chat-images');

create policy "chat image: user upload folder sendiri"
  on storage.objects for insert
  with check (
    bucket_id = 'chat-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "chat image: user hapus file sendiri"
  on storage.objects for delete
  using (
    bucket_id = 'chat-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
