-- Izinkan pengirim menghapus pesannya sendiri (dipakai untuk reset chat dummy saat keluar room)
create policy "pengirim hapus pesan miliknya sendiri"
  on messages for delete
  using (sender_id = auth.uid());
