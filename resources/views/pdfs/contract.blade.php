<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Contract Kerjasama</title>
    <style>
        body{
           font-family: 'Times New Roman', Times, serif;
           text-align: justify;
           line-height: 28px;
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
            margin-left: 1rem;
        }

        .border-bot{
            border-bottom: 2px solid #000000
        }

        .text-center{
            text-align: center;
        }

        tr{
            width: 100%
        }
        th{
            width: 18rem
        }
        td{
            text-align: center
        }
        .font_white{
            color: white
        }
        ol{
            margin-top: -1px;
            line-height: 28px;
        }
        li{
            line-height: 28px;
        }
        br{
            line-height: 28px;
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
            <div>Nomor Surat : {{ $contract->reference_num }}</div>
            <div>Berlaku: <b>{{ \Carbon\Carbon::parse($contract->contract_start)->format('d F Y') }}</b> sampai <b>{{ \Carbon\Carbon::parse($contract->contract_end)->format('d F Y') }}</b></div>
            <br>
            <div>Pada hari ini, <b>{{ \Carbon\Carbon::parse($contract->contract_start)->locale('id')->translatedFormat('l') }}
</b>, Tanggal <b>{{ \Carbon\Carbon::parse($contract->contract_start)->format('d F Y') }}</b>
, yang bertanda tangan di bawah ini</div>
            <div class=""><b>1. {{ $client->company_name }}</b></div>
            <div class="tab-1">
                <div>Alamat : {{ $contract->full_address }}</div>
                <div>Telp: {{ $contract->tlp_num }}</div>
                @foreach ($pics as $key => $pic)
                    <div>Telp: {{ $pic->pic_tlp_num }} a/n {{ $pic->pic_name }}, sebagai {{ $pic->pic_position }}</div>
                @endforeach
                <div>Selanjutnya disebut sebagai <b>PlHAK PERTAMA</b></div>
            </div>
            <br>
            <div class=""><b>2. PRO INSIGHT</b></div>
            <div class="tab-1">
                <div>Alamat : Ruko Cahaya Garden Blok B2-01 Tahap 2, Batam Centre</div>
                <div>Telp: 0853-5575-8581</div>
                <div>Telp: 08117755996 a/n Felix Zeng, B.CS sebagai Creative Agency Coordinator</div>
                <div>Selanjutnya disebut sebagai <b>PiHAK KEDUA</b></div>
            </div>
        </div>

        <div style="page-break-after: always;"></div>

        <div>Kedua belah pihak sepakat untuk mengadakan <b>Perjanjian Kerjasama Paket “{{ $contract->package }}”</b> dengan ketentuan sebagai berikut: </div>
        <br>
        <div class="text-center"><b>Pasal 1</b></div>
        <div class="text-center"><b>Tujuan Kerjasama</b></div>
        <div>Perjanjian ini dibuat dengan tujuan untuk menjalin kerjasama dalam bidang social media dimana, Pihak Pertama memberikan pekerjaan kepada Pihak Kedua, dan Pihak Kedua menerima pekerjaan dari Pihak Pertama untuk mengelola akun media sosial Pihak Pertama (seperti 
        Instagram, Tiktok dan Facebook) dengan kebijakan dan persyaratan yang akan dibahas lebih lanjut. 
        </div>
        <br>
        <div class="text-center"><b>Pasal 2</b></div>
        <div class="text-center"><b>Hak dan Kewajiban Pihak Pertama </b></div>
        <div class="border-bot">
            <div>Kewajiban : </div>
            <div class="tab-1">
                <ol>
                    <li><b>Pihak Pertama</b> berkewajiban menyerahkan akses berupa <b>username</b> dan <b>password</b> akun media sosial kepada <b>Pihak Kedua</b> untuk keperluan operasional. </li>
                    <li><b>Pihak Kedua</b> berkewajiban menjaga kerahasiaan dan tidak menyebarluaskan informasi terkait <b>username</b> dan <b>password</b> akun media sosial milik <b>Pihak Pertama</b> kepada pihak ketiga tanpa persetujuan tertulis. </li>
                    <li><b>Pihak Kedua</b> bertanggung jawab dalam penyusunan konsep dan pembuatan konten media sosial milik <b>Pihak Pertama.</b> </li>
                    <li><b>Pihak Kedua</b> akan melakukan pembaruan atau unggahan konten media sosial di platform <b>Instagram</b> dan <b>Tiktok</b> sebanyak: 
                        <div class="tab-2">
                            <ol>
                                <li><b>{{ $package[$contract->package]['feeds'] }} Design Feeds, dan {{ $package[$contract->package]['x_per_minggu'] }} kali dalam seminggu</b> untuk <b>feed</b>, lengkap dengan <b>caption</b> dan <b>hashtag</b> yang dilakukan setiap hari <b>{{ $package[$contract->package]['hari'] }};</b> </li>
                                <li><b>{{ $package[$contract->package]['story'] }} Design Story</b>, yang dilakukan setiap hari secara <b>repetisi</b> untuk jumlah story yang telah ditentukan <b>Pihak Pertama;</b> </li>
                                <li><b>{{ $package[$contract->package]['reel'] }} Reels</b>, lengkap dengan <b>caption</b> dan <b>hashtag</b> yang dilakukan <b>{{ $package[$contract->package]['reel_post'] }}</b>; atau pada hari-hari lain sesuai kesepakatan kedua belah pihak.</li>
                            </ol>
                        </div>
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
        <div class="text-center"><b>Pasal 3</b></div>
        <div class="text-center"><b>Durasi Pengerjaan </b></div>
        <div>
            <ol>
                <li>Durasi paket yang diambil selama {{ $client->duration }} terhitung sejak tanggal {{ \Carbon\Carbon::parse($contract->contract_start)->format('d F Y') }} hingga {{ \Carbon\Carbon::parse($contract->contract_end)->format('d F Y') }}.</li>
                <li>Untuk Video Shooting proses pengerjaan membutuhkan 3-5 hari kerja.</li>
                <li>Untuk Design Post membutuhkan 1-3 hari kerja.</li>
            </ol>
        </div>
        <br>
        <div class="text-center"><b>Pasal 4</b></div>
        <div class="text-center"><b>Biaya</b></div>
        <div>
           Pihak Kedua telah menyetujui untuk mengambil paket “{{ $contract->package }}”, dengan total biaya sebesar Rp {{ number_format($contract->price, 0, ',', '.') }}, yang mencakup seluruh komponen layanan sebagaimana tercantum dalam perjanjian ini. Pembayaran atas biaya tersebut wajib diselesaikan oleh Pihak Kedua sesuai dengan ketentuan dan jadwal pembayaran yang telah ditentukan dalam kontrak ini.
        </div>
        
        <br>

        <div class="text-center"><b>Pasal 5</b></div>
        <div class="text-center"><b>Cara Pembayaran</b></div>
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
        <div class="text-center"><b>Pasal 6</b></div>
        <div class="text-center"><b>Lain-lain</b></div>
        <div>
            Hal-hal yang belum tercantum atau diatur dalam perjanjian kerjasama ini akan dibahas dan disepakati lebih lanjut oleh kedua belah pihak dalam suatu perjanjian terpisah. 
        </div>
        <br>
        <div class="text-center"><b>Pasal 7</b></div>
        <div class="text-center"><b>Penutup</b></div>
        <div>
            Perjanjian ini dibuat dalam 2 (dua) rangkap asli, yang masing-masing memiliki kekuatan hukum yang sama, dimana 1 (satu) rangkap disimpan oleh <b>Pihak Pertama</b> dan 1 (satu) rangkap disimpan oleh <b>Pihak Kedua</b>. 
        </div>
        
        <div style="page-break-after: always;"></div>

        <div>
            Demikian perjanjian ini dibuat dalam 2 (dua) rangkap yang masing-masing mempunyai kekuatan hukum yang sama dan ditandatangani dalam keadaan sadar tanpa ada paksaan dari pihak manapun. 
        </div>
    </div>

    <br>
    <br>
    <br>
    <div>
        <table>
            <thead>
                <tr>
                    <th>PIHAK PERTAMA</th>
                    <th>PIHAK KEDUA</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ $client->company_name }}</td>
                    <td>PRO INSIGHT</td>
                </tr>
                <tr>
                    <td class="font_white">a</td>
                    <td class="font_white">a</td>
                </tr>
                <tr>
                    <td class="font_white">a</td>
                    <td class="font_white">a</td>
                </tr>
                <tr>
                    <td>{{ $pics[0]->pic_name }}</td>
                    <td>Felix Zeng, B. CS</td>
                </tr>
                <tr>
                    <td>{{ $pics[0]->pic_position }}</td>
                    <td>Creative Agency Coordinator</td>
                </tr>
                @foreach ($pics->skip(1) as $key => $pic)
                    <>
                        <tr>
                            <td class="font_white">{{ $client->company_name }}</td>
                        </tr>
                        <tr>
                            <td>{{ $client->company_name }}</td>
                        </tr>
                        <tr>
                            <td class="font_white">a</td>
                        </tr>
                        <tr>
                            <td class="font_white">a</td>
                        </tr>
                        <tr>
                            <td>{{ $pic->pic_name }}</td>
                        </tr>
                        <tr>
                            <td>{{ $pic->pic_position }}</td>
                        </tr>
                    </>
                @endforeach
            </tbody>
        </table>
    </div>

    
   </div>
</body>
</html>