const soalMtk = [
{
    id: 1,
    type: 'pg_kompleks',
    gambar: null,
    soal: '“Proyek Miniatur Taman Kota”\n\nDenah taman berbentuk persegi panjang dengan panjang (x + 10) meter dan lebar (x – 2) meter.\nDi tengah taman terdapat kolam berbentuk lingkaran dengan jari-jari 4 meter.\n\nDiketahui luas daerah taman (persegi panjang saja) adalah 108 m².\n\nDi salah satu sudut taman dibangun menara berbentuk prisma segitiga tegak.\nAlas prisma adalah segitiga siku-siku dengan sisi siku-siku 6 meter dan 8 meter.\nTinggi prisma tahun pertama adalah (x – 1) meter.\n\nTinggi menara mengikuti barisan aritmetika dengan beda 2 meter per tahun.\n\nTentukan SEMUA pernyataan yang benar!',
    jawaban_benar: [
        'Nilai x adalah 8.',
        'Volume prisma tahun pertama adalah 168 m³.',
        'Tinggi menara tahun ke-4 adalah 13 meter.',
        'Luas kolam adalah 16π m².'
    ],
    jawaban_salah: []
},

{
    id: 2,
    type: 'pg',
    gambar: null,
    soal: '“Proyek Eco–Geometry Park”\n\nTinggi menara mengikuti barisan aritmetika.\nTahun pertama setinggi (x – 1) meter dan setiap tahun bertambah 3 meter.\n\nJika pada tahun ke-3 tinggi menara adalah 13 meter, maka nilai x adalah…',
    jawaban_benar: '8',
    jawaban_salah: ['5', '6', '7']
},

{
    id: 3,
    type: 'pg_kompleks',
    gambar: null,
    soal: 'Sebuah prisma segitiga memiliki alas segitiga siku-siku dengan sisi 9 meter dan 12 meter.\n\nVolume prisma adalah 540 m³.\n\nPilih SEMUA pernyataan yang benar!',
    jawaban_benar: [
        'Luas alas prisma adalah 54 m².',
        'Tinggi prisma adalah 10 meter.',
        'Panjang sisi miring alas adalah 15 meter.',
        'Volume sesuai rumus Luas Alas × Tinggi.'
    ],
    jawaban_salah: []
},

{
    id: 4,
    type: 'pg',
    gambar: null,
    soal: 'Segitiga siku-siku memiliki sisi siku-siku 6 cm dan 8 cm.\nDiameter lingkaran sama dengan sisi miring segitiga tersebut.\n\nNilai diameter adalah…',
    jawaban_benar: '10',
    jawaban_salah: ['11', '12', '14']
},

{
    id: 5,
    type: 'pg_kompleks',
    gambar: null,
    soal: 'Trapesium memiliki sisi sejajar 10 cm dan 14 cm serta tinggi 6 cm.\n\nSegitiga baru dibuat dengan skala 1:2 (setengahnya) dari segitiga siku-siku berukuran 6–8–10.\n\nPilih SEMUA pernyataan yang benar!',
    jawaban_benar: [
        'Luas trapesium adalah 72 cm².',
        'Sisi miring segitiga kecil adalah 5 cm.',
        'Luas segitiga kecil adalah 6 cm².',
        'Skala 1:2 membuat setiap panjang sisi menjadi setengah kali semula.'
    ],
    jawaban_salah: []
},

{
    id: 6,
    type: 'pg',
    gambar: null,
    soal: 'Sebuah tabung memiliki jari-jari 6 cm dan tinggi 8 cm.\nIsinya akan dituang ke dalam beberapa kerucut yang masing-masing memiliki jari-jari 6 cm dan tinggi 8 cm.\n\nBanyak kerucut yang dapat diisi penuh adalah…',
    jawaban_benar: '3',
    jawaban_salah: ['1', '2', '4']
},

{
    id: 7,
    type: 'pg_kompleks',
    gambar: null,
    soal: 'Sebuah kelas berjumlah 20 siswa.\nRata-rata ulangan pertama 72.\n\nSetiap siswa yang naik ≥10 poin mendapat 2 kupon.\nSiswa lainnya 1 kupon.\n\nJika peluang terambil kupon dari siswa yang naik ≥10 poin adalah 2/3, pilih SEMUA pernyataan yang benar!',
    jawaban_benar: [
        'Banyak siswa yang naik ≥10 poin adalah 10 orang.',
        'Jumlah seluruh nilai ulangan pertama adalah 1440.',
        'Jumlah seluruh kupon yang dibagikan adalah 30.',
        'Peluang terambil kupon dari siswa yang naiknya <10 poin adalah 1/3.'
    ],
    jawaban_salah: []
}, 

{
    id: 8,
    type: 'benar_salah',
    gambar: null,
    soal: '“Proyek Science Geometry Center”\n\nSebuah taman berbentuk persegi panjang dengan ukuran (x + 8) meter dan (x – 2) meter.\nDi tengahnya terdapat kolam lingkaran dengan jari-jari (x – 5) meter.\n\nDiketahui nilai x adalah 10.\n\nMenara prisma segitiga di sudut taman memiliki alas segitiga siku-siku (9m, 12m, 15m).\nTinggi menara tahun pertama adalah (x – 3) meter dan bertambah 2 meter setiap tahun.\n\nTentukan setiap pernyataan berikut BENAR atau SALAH!',
    pernyataan: [
        {
            teks: 'Diameter kolam sama dengan panjang sisi miring alas prisma yaitu 10 meter.',
            benar: true
        },
        {
            teks: 'Luas taman (tanpa kolam) dengan x = 10 dan π = 3 adalah 69 m².',
            benar: true
        },
        {
            teks: 'Volume prisma pada tahun pertama adalah 378 m³.',
            benar: true
        },
        {
            teks: 'Tinggi menara pada tahun ke-4 adalah 13 meter.',
            benar: true
        }
    ]
}
];
