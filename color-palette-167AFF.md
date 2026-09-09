# Color Palette — sahabatTKA (Biru #167AFF)

## Primary Brand Color
- **Brand Blue**: `#167AFF`

## Full Token Set (flat, no gradients)

### Brand / Accent
| Token | Hex | Pemakaian |
|---|---|---|
| `--brand` | `#167AFF` | Header, tombol utama, ikon aktif, aksen teks |
| `--brand-100` | `#E6F2FF` | Hover state di atas background putih |
| `--brand-200` | `#B3D9FF` | Active/pressed state ringan |
| `--brand-300` | `#80BFFF` | Tint dekoratif ringan |
| `--brand-600` | `#0051D4` | Hover tombol solid, link |
| `--brand-700` | `#003BA3` | Active tombol solid, teks error/link kontras tinggi |

### Ground & Ink (tetap dari desain asli)
| Token | Hex | Pemakaian |
|---|---|---|
| `--ground` | `#f3f2f2` | Background halaman |
| `--surface` | `#eae9e9` | Panel/section alternatif |
| `--ink` | `#201e1d` | Teks utama, border 2px |
| `--neutral-200` | `#e4e2e2` | Border tipis, divider |
| `--neutral-300` | `#cfcccc` | Placeholder foto/avatar |

## CSS Variables (ganti langsung di `app/globals.css`)

```css
:root {
  --ground: #f3f2f2;
  --surface: #eae9e9;
  --ink: #201e1d;

  --brand: #167AFF;
  --brand-100: #E6F2FF;
  --brand-200: #B3D9FF;
  --brand-300: #80BFFF;
  --brand-600: #0051D4;
  --brand-700: #003BA3;

  --neutral-200: #e4e2e2;
  --neutral-300: #cfcccc;
}
```

Cukup ganti 6 nilai `--brand*` di atas — semua kelas yang sudah pakai `bg-brand`, `text-brand`, `hover:bg-brand-100`, dll otomatis ikut berubah ke biru, tanpa menyentuh markup manapun.

## Catatan
- Tidak ada gradasi — semua warna solid/flat, sesuai gaya Modernist (border 2px, tanpa radius).
- Warna semantik (sukses/error/warning) sengaja tidak diubah karena tidak dipakai di token brand saat ini; tambahkan sendiri bila dibutuhkan.
