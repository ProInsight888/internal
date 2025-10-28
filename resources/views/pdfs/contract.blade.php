<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Contract Kerjasama</title>
    <style>
        body{
           font-family: Helvetica;
           line-height: 40px;
        }
        .container{
            padding: 4rem 3rem 4rem 4rem;
        }
        .logo-container{
            padding-left: 8.5rem;
            /* background-color: #b34a4a; */
        }
        .logo{
            width: 70%;
            height: fit-content;
            /* background-color: #fff; */
        }
        .proinsight-small-identity{
            margin: 2rem;
            padding: 1rem 2.3rem;
            margin-bottom: 2.5rem;
            border: 2px solid rgb(255, 166, 0);
            border-radius: 1.5rem
        }
        .pro-insight-address{
            margin-left: 5%;
            font-size: 12pt;
            /* margin-bottom: 1rem; */
        }
        .proinsight-tlp-email{
            font-size: 12pt;
            margin-left: 0.5rem;
        }
        .pro-insight-text{
            margin-left: 31%;
            font-size: 22pt;
            /* margin-bottom: 0.7rem;         */
        }
        .bold{
            font-weight: bolder
        }
        .underline{
            text-decoration: underline;
        }
        .proinsight-insight-text{
            font-family: sans-serif;
        }
        .tab-1,
        .tab-2{
            margin-left: 2rem;
        }

        .border-bot{
            border-bottom: 2px solid #000000
        }
    </style>
</head>
<body>
   <div class="container">
    <div class="logo-container">
        <img src="{{ $imageLogo }}" class="logo" alt="">
    </div>
    <div class="proinsight-small-identity">
        <div class="pro-insight-text">
            <b>PRO INSIGHT</b>
        </div>
        <div class="pro-insight-address">
            Ruko Cahaya Garden Blok B2-01 Tahap 2, Batam Centre
        </div>
        <div class="proinsight-tlp-email">
            <div>Telp : 0853-5575-8581&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Email : proinsight888@gmail.com</div>
        </div>
    </div>
    <div>
        <div class=""><b><u>SURAT PERJANJIAN KERJASAMA</u></b></div>
        <div>
            <div>Nomor Surat : {{ $client->reference_num }}</div>
            <div>Berlaku: {{ $client->contract_start }} sampai {{ $client->contract_end }}</div>
            <br>
            <div>Pada hari ini, <b>Rabu</b>, Tanggal 10-01-2025, yang bertanda tangan di bawah ini</div>
            <div>
                <div class=""><b>1. {{ $client->company_name }}</b></div>
                <div>Alamat : {{ $client->full_address }}</div>
                <div>Telp: {{ $client->tlp_num }}</div>
                @foreach ($pics as $key => $pic)
                    <div>Telp: {{ $pic->pic_name }} a/n {{ $pic->pic_tlp_num }}, sebagai {{ $pic->pic_position }}</div>
                @endforeach
                <div>Selanjutnya disebut sebagai <b>PlHAK PERTAMA</b></div>
            </div>
            <br>
            <div>
                <div class=""><b>2. PRO INSIGHT</b></div>
                <div>Alamat : Ruko Cahaya Garden Blok B2-01 Tahap 2, Batam Centre</div>
                <div>Telp: 0853-5575-8581</div>
                <div>Telp: 08117755996 a/n Felix Zeng, B.CS sebagai Creative Agency Coordinator</div>
                <div>Selanjutnya disebut sebagai <b>PiHAK KEDUA</b></div>
            </div>
        </div>
        <br>
        <div>Kedua belah pihak sepakat untuk mengadakan <b>Perjanjian Kerjasama Paket “{{ $client->package }}”</b> dengan ketentuan sebagai berikut: </div>
        <br>
        <div><b>Pasal 1</b></div>
        <div><b>Tujuan Kerjasama</b></div>
        <div>Perjanjian ini dibuat dengan tujuan untuk menjalin kerjasama dalam bidang social media dimana, Pihak Pertama memberikan pekerjaan kepada Pihak Kedua, dan Pihak Kedua menerima pekerjaan dari Pihak Pertama untuk mengelola akun media sosial Pihak Pertama (seperti 
        Instagram, Tiktok dan Facebook) dengan kebijakan dan persyaratan yang akan dibahas lebih lanjut. 
        </div>
        <br>
        <div><b>Pasal 2</b></div>
        <div><b>Hak dan Kewajiban Pihak Pertama </b></div>
        <div class="border-bot">
            <div>Kewajiban : </div>
            <div class="tab-1">
                <ol>
                    <li><b>Pihak Pertama</b> berkewajiban menyerahkan akses berupa <b>username</b> dan <b>password</b> akun media sosial kepada <b>Pihak Kedua</b> untuk keperluan operasional. </li>
                    <li><b>Pihak Kedua</b> berkewajiban menjaga kerahasiaan dan tidak menyebarluaskan informasi terkait <b>username</b> dan <b>password</b> akun media sosial milik <b>Pihak Pertama</b> kepada pihak ketiga tanpa persetujuan tertulis. </li>
                    <li><b>Pihak Kedua</b> bertanggung jawab dalam penyusunan konsep dan pembuatan konten media sosial milik <b>Pihak Pertama.</b> </li>
                    <li><b>Pihak Kedua</b> akan melakukan pembaruan atau unggahan konten media sosial di platform <b>Instagram</b> dan <b>Tiktok</b> sebanyak: 
                        <ol>
                            <li><b>16 (enam belas) Design Feeds, dan 4 (empat) kali dalam seminggu</b> untuk <b>feed</b>, lengkap dengan <b>caption</b> dan <b>hashtag</b> yang dilakukan setiap hari <b>Senin, Selasa, Kamis dan Jumat;</b> </li>
                            <li><b>8 (delapan) Design Story</b>, yang dilakukan setiap hari secara <b>repetisi</b> untuk jumlah story yang telah ditentukan <b>Pihak Pertama;</b> </li>
                            <li><b>4 (empat) Reels</b>, lengkap dengan <b>caption</b> dan <b>hashtag</b> yang dilakukan <b>seminggu sekali</b>; atau pada hari-hari lain sesuai kesepakatan kedua belah pihak.</li>
                        </ol>
                    </li>
                    <li><b>Pihak Pertama</b> dapat memberikan informasi dan pengetahuan produk <b>(product knowledge)</b> yang dibutuhkan <b>Pihak Kedua</b> dalam menyusun konten dan setelah telah selesai <b>Pihak Pertama</b> dapat melalukan pengecekan dan revisi. </li>
                    <li><b>Pihak Pertama</b> juga berkewajiban memberikan informasi terbaru yang akan dijadikan materi promosi, seperti diskon, giveaway, serta kegiatan perusahaan (misalnya pameran), guna menghindari kekeliruan informasi di media sosial. </li>
                    <li><b>Pihak Kedua</b> tidak bertanggung jawab terhadap biaya iklan berbayar (misalnya endorse, paid promote, dan sebagainya), kecuali terdapat pembayaran terpisah dari <b>Pihak Pertama</b> kepada <b>Pihak Kedua</b> untuk pelaksanaan iklan tersebut. Dan akan dikenakan fee jasa sekali selama sebulan sebesar Rp 50.000. </li>
                    <li>Apabila <b>Para Pihak</b> menghentikan perjanjian kerjasama secara sepihak tanpa kesepakatan bersama, maka <b>Pihak yang menghentikan perjanjian kerjasama secara sepihak</b> wajib membayarkan kompensasi sebesar nilai sisa kontrak yang telah disepakati dalam perjanjian ini. </li>
                </ol>
            </div>
        </div>
        <div>
            <div>Hak : </div>
            <div class="tab-1">
                <ol>
                    <li><b>Pihak Pertama</b> berhak memperoleh pembaruan konten media sosial sesuai ketentuan yang telah disebutkan di atas. </li>
                    <li><b>Pihak Pertama</b> berhak menerima 1 (satu) video motion graphic selama 1 (satu) bulan, dengan ketentuan bahwa <b>Pihak Pertama</b> menyediakan materi atau bahan yang akan dijadikan isi dari video tersebut. </li>
                    <li><b>Pihak Pertama</b> berhak menerima Feedback Reports setiap tanggal 30 setiap bulan. </li>
                    <li><b>Pihak Pertama</b> berhak menerima Design Hari Besar untuk tahun 2025.</li>
                    <li><b>Pihak Pertama</b> berhak memberikan masukan, arahan, atau pendapat kepada <b>Pihak Kedua</b> sehubungan dengan strategi promosi usaha yang dimilikinya. </li>
                    <li>Kedua belah pihak memiliki hak untuk mengakhiri kontrak apabila salah satu pihak tidak menjalankan kewajibannya sebagaimana mestinya. </li>
                    <li>Seluruh hasil karya desain, foto, dan video yang telah dipublikasikan selama masa kerjasama merupakan hak milik penuh dari <b>Pihak Pertama</b>. </li>
                </ol>
            </div>
        </div>
        <br>
        <div><b>Pasal 3</b></div>
        <div><b>Durasi Pengerjaan </b></div>
        <div>
            <ol>
                <li>Durasi paket yang diambil selama 1 bulan terhitung sejak tanggal mm-dd-yyyy hingga mmdd-yyyy </li>
                <li>Untuk Video Shooting proses pengerjaan membutuhkan 3-5 hari kerja 3. Untuk Design Post membutuhkan 1-3 hari kerja </li>
            </ol>
        </div>
        <br>
        <div><b>Pasal 4</b></div>
        <div><b>Biaya</b></div>
        <div>
            Harga paket yang akan diambil adalah “PRO-TALL” seharga Rp xxxxxxx 
        </div>
        <br>
        <div><b>Pasal 5</b></div>
        <div><b>Cara Pembayaran</b></div>
        <div>
            <ol>
                <li>Pembayaran awal wajib dilakukan paling lambat 1 (satu) hari kalender setelah penandatanganan surat perjanjian kerjasama ini. </li>
                <li>Sistem pembayaran dilakukan secara lunas di muka (pembayaran penuh di awal) sebelum pelaksanaan pekerjaan dimulai. </li>
                <li>Pembayaran ditransfer ke rekening berikut: 
                    <div>Bank BCA</div>
                    <div>a.n. Phygital Kreatif Konsultindo</div>
                    <div>No. Rekening: 8211-028-866 </div>
                </li>

            </ol>
        </div>
        <br>
        <div><b>Pasal 6</b></div>
        <div><b>Lain-lain</b></div>
        <div>
            Hal-hal yang belum tercantum atau diatur dalam perjanjian kerjasama ini akan dibahas dan disepakati lebih lanjut oleh kedua belah pihak dalam suatu perjanjian terpisah. 
        </div>
        <br>
        <div><b>Pasal 7</b></div>
        <div><b>Penutup</b></div>
        <div>
            <ol>
                <li>Perjanjian ini dibuat dalam 2 (dua) rangkap asli, yang masing-masing memiliki kekuatan hukum yang sama, dimana 1 (satu) rangkap disimpan oleh <b>Pihak Pertama</b> dan 1 (satu) rangkap disimpan oleh <b>Pihak Kedua</b>. </li>
            </ol>
        </div>
        <br>
        <div>
            Demikian perjanjian ini dibuat dalam 2 (dua) rangkap yang masing-masing mempunyai kekuatan hukum yang sama dan ditandatangani dalam keadaan sadar tanpa ada paksaan dari pihak manapun. 
        </div>
    </div>

    <div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PIHAK PERTAMA&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PIHAK KEDUA&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $client->company_name }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PRO INSIGHT&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
        <br>
        <br>
        <br>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $client->pic_name }}{{ $client->pic_title }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Felix Zeng, B. CS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $client->pic_position }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Creative Agency Coordinator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
    </div>

    
   </div>
</body>
</html>