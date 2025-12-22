
import { type LucideIcon, Footprints } from 'lucide-react';

export interface Marker {
  id: string;
  longitude: number;
  latitude: number;
  image: string;
  width: number;
  height: number;
  anchor: string;
  content: string;
  tooltip: string;
}

export interface Topic {
  slug: string;
  title: string;
  Icon: LucideIcon;
  details: string;
  category: 'biosecurity' | 'animal-husbandry' | 'animal-trade' | 'animal-barn';
  view360?: {
    image: string;
  };
  audio?: string;
  markers?: Marker[];
}

const details = 'Effective grazing management for small ruminants like sheep and goats is essential for their health, productivity, and the sustainability of pastures. Implement rotational grazing systems to prevent overgrazing, reduce parasite load, and allow forage to recover. Explore the 360-degree interactive view below to see an example of a grazing environment.';

export const topics: Topic[] = [
  {
    slug: 'koyunlarda-yaylim-1',
    title: 'Koyunlarda Yaylım - 1',
    Icon: Footprints,
    details: details,
    category: 'animal-husbandry',
    view360: {
      image: '/pictures/koyunlarda-yaylim-1.jpg',
    },
    audio: '/pictures/koyunlarda-yaylim-1.wav',
    markers: [
      {
        id: 'info-marker-1',
        longitude: 1.3076846156226127,
        latitude: -0.2695458410108946,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        // zayıf mera
        content: `<div style="max-width: 640px; padding: 1rem; color: black; background: white; border-radius: 0.5rem; font-family: sans-serif;"><h1><b>Zayıf Meraların Zorlukları</b></h1><p>Düşük kaliteli meralardan kaynaklanan yetersiz beslenme, koyunların refahı ve normal davranışları için doğrudan ve ciddi bir tehdit oluşturur.</p><h2>Refah Üzerindeki Etkileri:</h2><ul><li><b>Beslenme Yetersizlikleri ve Kötü Vücut Kondisyonu:</b> Bu en doğrudan sonuçtur. Koyunlar, yiyecek aramak için tükettiklerinden daha fazla enerji harcadıklarından kilo ve vücut kondisyonu kaybederler. Bu durum bağışıklık sistemlerini zayıflatarak onları hastalıklara ve parazitlere karşı daha savunmasız hale getirir.</li><li><b>Azalan Verimlilik:</b> Zayıf meralardaki dişi koyunların gebe kalma oranları düşer, daha az sayıda ve daha küçük kuzular doğururlar ve yavrularını beslemek için yeterli süt üretemezler. Yün gelişimi ve kalitesi de olumsuz etkilenir.</li><li><b>Artan Stres:</b> Sürekli yiyecek arayışı ve açlığın fizyolojik etkileri, hayvanın genel sağlığını kademeli olarak olumsuz etkileyen önemli stres faktörleridir.</li></ul><h2>Davranışsal Etkileri:</h2><ul><li><b>Artan Otlama Süresi ve Mesafesi:</b> Koyunlar günün çok daha büyük bir bölümünü otlayarak geçirir ve lezzetli yem bulmak için daha uzak mesafelere giderler. Bu artan aktivite, zaten sınırlı olan enerji rezervlerini daha da tüketir.</li><li><b>Daha Az Seçici Otlama:</b> Zayıf meralardaki koyunlar, zorunluluktan dolayı daha az lezzetli ve besin değeri düşük olanlar da dahil olmak üzere çok daha çeşitli bitkileri tüketirler.</li><li><b>Değişen Sosyal Davranışlar:</b> Beslenme stresi, sürü içindeki sosyal gerilimleri şiddetlendirebilir.</li><ul><li><b>Artan Rekabet:</b> Sınırlı yem için rekabet arttıkça, süründeki baskınlık hiyerarşisi daha belirgin hale gelir. Genellikle genç veya zayıf olan alt düzeydeki hayvanlar dışlanabilir ve yetersiz beslenmeden en çok onlar etkilenir.</li><li><b>Sürü Bütünlüğündeki Değişiklikler:</b> Koyunların korunmak için güçlü bir sürü içgüdüsü olsa da, şiddetli yiyecek kıtlığı sosyal dinamiklerde değişikliklere yol açabilir. Sürü, yem aramak için daha geniş bir alana yayılabilir ve normal sosyal bağlar, hayatta kalma rekabeti nedeniyle zayıflayabilir.</li></ul></ul></div>`,
        tooltip: 'More Information',
      },
      {
        id: 'info-marker-2',
        longitude: 2.2941929472433147,
        latitude: -0.1304712404331032,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        // kümelenmiş koyunlar
        content: `<div style="max-width: 640px; padding: 1rem; color: black; background: white; border-radius: 0.5rem; font-family: sans-serif;"><p>Burada yer yer kümelenmiş gibi görünselerde koyunların küçük gruplar halinde geniş bir alana yayıldıklarını görüyoruz. Bu kümelenme davranışı farklı durumlarda ortaya çıkabilir. Bunlardan en yaygını <b>avcı tehditidir</b>. Bu durum <b>bencil sürü teorisine</b> göre <b>dilüsyon etkisi</b> ile açıklanır. Bir avcıya karşı en güvende olan birey, kalabalığın en ortasına olanlardır. Bu, ortaya doğru ilerlemeye iter ve sürü çapında yalım alanı küçülür. Tek başına sürünün dışında kalan bir birey için tehlike sadece o birey için çok yüksek seviyededir ancak o bireyde bu kümelenmeye dahil olduğunda artık <b>risk bireyler arasında bölünür</b> ve tehlikenin seviyesi o birey için çok büyük oranda azalırken diğer bireyler için çok az miktarda artar. Tehlikenin bu şekilde paylaşılması sebebi ile duruma dilüsyon etkisi denir.</p></div>`,
        tooltip: 'More Information',
      },
      {
        id: 'info-marker-3',
        longitude: 0.48685152225452416,
        latitude: -0.09481387221356785,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        // aynı anda otlayan koyunlar
        content: `<div style="max-width: 640px; padding: 1rem; color: black; background: white; border-radius: 0.5rem; font-family: sans-serif;"><p>Koyunların hepsi aynı anda otlanıyor. Bu durum senkronizasyonun %100 olduğunu gösterir.</p><h2>Koyunlarda Yem Yeme Senkronizasyonu</h2><p><strong>Sürü Dinamiği ve Güvenlik:</strong> Koyunlar sosyal hayvanlardır ve sürü halinde yaşamayı tercih ederler. Toplu halde yem yeme, avcılardan korunma içgüdüsünün bir sonucudur. Sürü üyeleri etrafta tehlike sezdiklerinde toplu halde kaçış veya savunma davranışlarını uyarmak için tetikte beklerler ve bu durumda senkronizasyonun oranı çok düşüktür.</p><p><strong>Davranışsal Taklit (Allelomimetik Davranış):</strong> Sürüdeki bir veya birkaç koyun yem yemeye başladığında, diğerleri de bu davranışı taklit ederek otlamaya başlar. Bu taklitçi davranış (allelomimetik davranış), sürünün büyük bir kısmının aynı anda yem yemesini sağlar. Bu durum, özellikle meralarda otlayan koyunlarda belirgin olarak gözlemlenir.</p><p><strong>Zamanlama ve Ritim:</strong> Koyunlar genellikle gün içinde belirli periyotlarda yoğun bir şekilde otlarlar. Bu periyotlar genellikle sabahın erken saatleri ve akşamüstü/gün batımı zamanlarına denk gelir. Bu zamanlar hava şartları ile ilgili olarak otlamanın hayvanlar için en konforlu olduğu zamanlardır. Bir otlama periyodunu takiben genellikle geviş getirme ve dinlenme periyotları gelir, ve bu döngüler de sürü içinde senkronize olma eğilimindedir.</p><p><strong>Stres ve Rekabetin Azalması:</strong> Yem yeme senkronizasyonu, sürü içinde stres ve rekabeti azaltmaya yardımcı olabilir. Yeterli yem kaynağı olduğunda, tüm koyunlar aynı anda yeme erişim sağladığında, yem kaynakları üzerindeki çekişme azalır.</p><hr><p>Özetle, koyunlarda yem yeme senkronizasyonu, onların sosyal doğalarından kaynaklanan, güvenlik, davranışsal taklit ve doğal ritimlerle şekillenen bir davranıştır. Bu senkronizasyon, hem bireysel koyunların refahı hem de sürünün genel verimliliği ve mera yönetimi açısından önemli faydalar sunar.</p></div>`,
        tooltip: 'More Information',
      },
    ],
  },
  {
    slug: 'koyunlarda-yaylim-2',
    title: 'Koyunlarda Yaylım - 2',
    Icon: Footprints,
    details: details,
    category: 'animal-husbandry',
    view360: {
      image: '/pictures/koyunlarda-yaylim-2.jpg',
    },
    audio: '/pictures/koyunlarda-yaylim-2.wav',
    markers: [
      {
        id: 'info-marker-4',
        longitude: 0.026167607416620924,
        latitude: -0.3972336445392497,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        // kuyruk kesimi
        content: `<div style="max-width: 640px; padding: 1rem; color: black; background: white; border-radius: 0.5rem; font-family: sans-serif;"><h3 style="margin-top: 0; margin-bottom: 0.5rem; font-size: 1.1rem;">Koyun Kuyrukları Neden Kesilir?</h3><p>Koyunlarda kuyruk kesiminin başlıca nedenleri şunlardır:</p><ul><li><strong>Miyazisi Önleme:</strong> Bu en önemli nedendir. Uzun, yünlü kuyruklu koyunlarda, arka bölgelerde (kuyruk altı) dışkı ve idrar birikebilir. Bu sıcak ve nemli ortam, sinekler için oldukça çekicidir ve sinekler yumurtalarını kirli yünlere bırakır. Yumurtalar larva haline gelir ve koyunun etine girerek büyük acı, rahatsızlık, ikincil bakteriyel enfeksiyonlar, toksinler ve tedavi edilmezse ölüme neden olabilir. Kuyruk kesimi, dışkı birikme alanını önemli ölçüde azaltarak sinek saldırısı riskini düşürür.</li><li><strong>Dışkı Bulaşmasını (Dagging) Azaltma:</strong> Daha kısa bir kuyruk, dışkı ve idrarla kirlenecek daha az yün anlamına gelir, bu da daha temiz hayvanlara yol açar. Bu aynı zamanda kırkımı kolaylaştırır ve kesimhanede karkas hijyenini artırır.</li><li><strong>Estetik Nedenler (Gösteri Koyunları İçin):</strong> Bazı durumlarda, özellikle gösteri koyunlarında, kuyruklar daha büyük ve etli bir arka görünümü vermek için çok kısa kesilebilir. Ancak, bu uygulama ciddi refah endişeleri nedeniyle büyük ölçüde teşvik edilmemektedir.</li></ul><h3>Hayvan Refahı Üzerindeki Etkileri</h3><ul><li><strong>Acı ve Stres:</strong><ul><li><strong>Akut Acı:</strong> Kuyruk kesimi, kullanılan yöntem ne olursa olsun (kauçuk halkalar, sıcak demir veya cerrahi müdahale) ağrılı bir işlemdir. Kuzular huzursuzluk, tekmeleme, damgalama, kafa çevirme ve ses çıkarma gibi ağrı davranışları gösterir. Yükselmiş kortizol seviyeleri gibi fizyolojik göstergeler de ağrı ve stresi doğrular.</li><li><strong>Kronik Acı:</strong> Özellikle daha kısa kuyruk kesimlerinde, kuyruk güdüğünde nöroma (kesilen sinirlerin anormal büyümesi) nedeniyle uzun süreli rahatsızlık ve kronik ağrı riski vardır.</li></ul></li><li><strong>Rektal Prolapsus Riskinde Artış:</strong> Eğer kuyruk çok kısa kesilirse, özellikle kaudal kıvrımın (rektumun her iki tarafındaki deri kıvrımları) distal ucundan daha kısa kesilirse, dışkılamayı kontrol eden kaslara müdahale edebilir. Bu, rektal prolapsus insidansını artırır; bu, rektumun bir kısmının anüsten dışarı çıkmasıyla oluşan ağrılı ve potansiyel olarak ölümcül bir durumdur.</li><li><strong>Perineal Kanser ve Artrit Riskinde Artış:</strong> Ultra-kısa kuyruk kesimi, hassas dokuların güneşe maruz kalması nedeniyle perineal kanser riskini artırabilir ve kuzularda daha yüksek bakteriyel artrit ve poliartrit insidansı ile ilişkilendirilmiştir.</li><li><strong>Doğal Fonksiyonun Bozulması:</strong> Kuyruk, anüsü ve vulvayı güneş yanığı ve donmaya karşı doğal olarak korur ve sinekleri uzaklaştırmak için kullanılır. Kuyruğun çok fazla kısmının çıkarılması bu koruyucu işlevleri tehlikeye atar.</li></ul><p><strong>Refah Endişeleri İçin Azaltma Stratejileri:</strong></p><ul><li><strong>Kesim Yaşı:</strong> Kesim, mümkün olan en genç yaşta, genellikle kuzunun hayatının ilk haftasında yapılmalıdır, çünkü ağrı yanıtı genellikle daha az şiddetlidir.</li><li><strong>Uygun Uzunluk:</strong> Kuyruk, dişi hayvanlarda vulvayı ve erkek hayvanlarda anüsü kapatacak kadar uzun olmasını sağlayacak şekilde, kaudal kıvrımın distal ucundan daha kısa olmamalıdır. Bu uzunluk, uygun işlevi sürdürmek ve sağlık risklerini en aza indirmek için çok önemlidir.</li><li><strong>Ağrı Kesici:</strong> Lokal anestezi ve sistemik analjezi (NSAID'ler gibi ağrı kesiciler) kullanımı, prosedürle ilişkili ağrı ve stresi azaltmak için şiddetle tavsiye edilir ve bazı bölgelerde yasal olarak zorunludur.</li><li><strong>Yetkili Personel:</strong> Kuyruk kesimi sadece eğitimli ve yetkili personel tarafından, bakımı iyi yapılmış ekipman ve kabul görmüş teknikler kullanılarak yapılmalıdır.</li><li><strong>Alternatif Yönetim:</strong> Bazı ırklar (örn. kıllı koyunlar veya doğal olarak kısa kuyruklular) veya düşük sinek saldırısı riski olan bölgelerde, rutin kuyruk kesimi gerekli olmayabilir. Kırkım (kuyruk ve kuyruk altı etrafındaki yünün kesilmesi), düzenli izleme ve böcek ilacı uygulamaları gibi diğer yönetim uygulamaları sinek saldırısını önlemeye yardımcı olabilir.</li></ul><h3>Hayvan Davranışları Üzerindeki Etkileri</h3><p>Kuyruk kesiminin davranışsal etkileri hala araştırılmaktadır, ancak bazı potansiyel etkiler şunlardır:</p><ul><li><strong>Ağrıya Bağlı Kısa Süreli Davranışsal Değişiklikler:</strong> Yukarıda bahsedildiği gibi, kuzular kesimden hemen sonra ağrıya karşı akut davranışsal tepkiler gösterirler; örneğin huzursuzluk, duruş değişikliği ve ses çıkarma. Bu, emzirme ve anne ile etkileşim gibi normal kuzu davranışlarını bozabilir.</li><li><strong>Potansiyel Uzun Vadeli Sosyal ve Annelik Davranışı Etkileri:</strong> Gelişmekte olan araştırmalar, kuyruk kesiminin neden olduğu gibi erken yaşam stresinin, bir hayvanın daha sonraki yaşamında sosyal davranışlarını, cinsel performansını ve hatta annelik davranışlarını potansiyel olarak uzun vadeli etkileyebileceğini düşündürmektedir. Örneğin, kuyruğu kesilmiş ve yapay olarak yetiştirilmiş kuzuların daha az sosyal bağ kurup kurmadığı veya daha az annelik davranışı gösterip göstermediği araştırılmaktadır. Ancak, bu karmaşık uzun vadeli davranışsal etkileri tam olarak anlamak için daha fazla araştırmaya ihtiyaç vardır.</li><li><strong>Değişen Dışkılama Duruşu:</strong> Çok kısa bir kuyruk, koyunun dışkılama sırasında kuyruğunu normal şekilde kaldırmasını veya hareket ettirmesini engelleyebilir, bu da kesime rağmen arka bölgelerin daha fazla kirlenmesine neden olabilir ve sinekleri uzaklaştırmak için doğal pervaneyi engelleyebilir.</li></ul><p>Sonuç olarak, kuyruk kesimi, sinek saldırısı gibi ciddi sağlık sorunlarını önlemeyi amaçlayan yaygın bir uygulama olsa da, ağrı ve potansiyel olumsuz uzun vadeli sağlık ve davranışsal etkileri nedeniyle önemli bir refah endişesidir. En iyi uygulamalar, <strong>yalnızca gerektiğinde</strong>, uygun yaş ve uzunlukta ve ağrı kesici kullanılarak kesim yapılmasını vurgulayarak acıyı en aza indirmeyi ve genel hayvan refahını teşvik etmeyi amaçlar.</p></div>`,
        tooltip: 'More Information',
      },
    ],
  },
  {
    slug: 'koyunlarda-yaylim-3',
    title: 'Koyunlarda Yaylım - 3',
    Icon: Footprints,
    details: details,
    category: 'animal-husbandry',
    view360: {
      image: '/pictures/koyunlarda-yaylim-3.jpg',
    },
    audio: '/pictures/koyunlarda-yaylim-3.wav',
    markers: [
      {
        id: 'info-marker-5',
        longitude: 0.8408699022355245,
        latitude: -0.07308079447166893,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: black; background: white; border-radius: 0.5rem; font-family: sans-serif;"><h2>Hayvan Refahının Değerlendirilmesinde Eşzamanlılık (Senkroni)</h2><p><b>Giriş</b><br>Eşzamanlı davranışlar (bir grup içindeki hayvanların beslenme veya dinlenme gibi aktiviteleri aynı anda gerçekleştirmesi) koyunlar da dahil olmak üzere çiftlik hayvanlarında sosyal bağlılık ve kaynak erişilebilirliğinin önemli bir göstergesidir. Yüksek eşzamanlılık seviyeleri, olumlu refah durumlarını yansıtan bir gösterge olarak hayvan refahı biliminde giderek daha çok kullanılmaktadır.</p><p><b>Neden Eşzamanlılık Hayvan Refahı İçin Önemlidir?</b></p><ul><li><b>Kaynaklara Erişim</b>: Yüksek eşzamanlılık gösteren gruplar genellikle yeterli alan ve kaynağa sahiptir; bu da rekabeti en aza indirir. Bu durum, özellikle alt sosyal seviyedeki hayvanların dışlanma veya stres yaşamasını önler.</li><li><b>Türlere Özgü Davranışlar</b>: Koyunlar gibi otlayan hayvanlar, beslenme ve dinlenme gibi belirli davranışlarını birlikte gerçekleştirmek üzere evrimleşmiştir. Eşzamanlı davranışları desteklemek, hayvanların doğal ritimlerine saygı göstermeyi ve psikolojik iyilik halini teşvik eder.</li><li><b>Sosyal Bağlılık</b>: Eşzamanlılık grup istikrarını artırır ve agresif davranışları azaltır. Bu, barışçıl ve iyi uyum sağlamış bir grup yapısının varlığına işaret eder.</li></ul><p><b>Eşzamanlılık Değerlendirmesi: Anlık Tarama Yöntemi (Instantaneous Scan Sampling)</b></p><p>En yaygın kullanılan yöntemdir. Gözlemciler belli aralıklarla her bir bireyin davranışını kaydeder. Eşzamanlılık, belirli bir anda aynı davranışı sergileyen hayvanların oranı olarak hesaplanır. Örnek olarak görseldeki sürüde yaklaşık olaran 10 hayvandan 7’sinin eş zamanlılık içerisinde olduğu görülmekte. Bu da eşzamanlılık oranının %70 olduğu şeklinde yorumlanır.</p><p><b>Dikkat Edilmesi Gerekenler</b></p><ul><li><b>Günün Zamanı</b>: Eşzamanlılık genellikle sabah ve akşam en yüksek düzeydedir. Bu nedenle refah değerlendirmelerinde doğal davranış ritimleri göz önünde bulundurulmalıdır; düşük eşzamanlılık dönemlerinde yapılan ölçümler yanlış yorumlanmamalıdır.</li><li>Bireysel farklılıklar, çevresel değişiklikler ve yönetim uygulamaları eşzamanlılığı etkileyebilir ve değerlendirme protokollerinde dikkate alınmalıdır.</li><li>Yüksek eşzamanlılık genellikle olumlu olmasına rağmen, stresli olaylar (örneğin toplu kaçınma davranışları) sırasında görülen eşzamanlılık pozitif refah olarak yanlış yorumlanmamalıdır.</li></ul><p><b>Müdehale</b></p><p>Yapılan gözlemde bir eksiklik tespit edildiğinde yapılması gereken bu problemin kaynağını analiz etmektir. Potansiyel bazı sebepler, barınakta yeterli ymelik alanının olması, otlakta yeterli besin olmaması, vahşi hayvan varlığı veya hayvanları ürkütebilecek yabancı insanların veya hayvanların varlığı, sürü yöneticisinin uygulamalarının huzursuzluk yatarması olabilir. Sebep tespit edildiğinde bu sorunlarla nasıl mücadele edilebileceği sürü yöneticisi ile tartışılmalıdır.</p><p><b>Sonuç</b></p><p>Özellikle beslenme ve dinlenme davranışlarındaki eşzamanlılık, koyunlar ve diğer grup halinde yaşayan hayvanlarda refah değerlendirmesi için pratik ve anlamlı bir hayvan-temelli göstergedir. Gözlem kolaylığı, kaynak erişimi ve sosyal bağlamla güçlü ilişkisi nedeniyle saha koşullarında refah izlemesinde yaygın olarak uygulanabilir.</p></div>`,
        tooltip: 'More Information',
      },
      {
        id: 'info-marker-6',
        longitude: 0.24782809477625395,
        latitude: -0.06936588074119188,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: black; background: white; border-radius: 0.5rem; font-family: sans-serif;"><h2>Koyunların Doğal Ortamlardaki Alan Davranışı ve Refah Değerlendirmesindeki Rolü</h2><p><b>Giriş</b><br>Koyunlar, doğal ve kısıtlanmamış ortamlarda, güvenlik algısı, kaynakların bolluğu ve sosyal ihtiyaçlarına bağlı olarak esnek bir alan davranışı sergilerler. Bu doğal alan davranışlarının anlaşılması, yönetilen sistemlerde koyun refahının yorumlanması ve etkili refah değerlendirme protokollerinin tasarımı için önemlidir.</p><p><b>Doğal Alan Dinamikleri</b></p><ul><li><b>Rahat Koşullar</b>: Tehlike yoksa ve kaynaklar bolsa, koyunlar otlarken veya dinlenirken doğal olarak biraz yayılırlar. Bu alan kullanımı, bireylerin yiyecek ve alan erişimini rekabetsiz ve stres yaşamadan sağlamalarına imkan verir. Bu durum, rahatlık, güvenlik ve düşük sosyal gerilim düzeyini gösterir.</li><li><b>Tehlike Anında Toplanma</b>: Koyunlar, av hayvanları olmaları nedeniyle güçlü sürüleşme içgüdüsüne sahiptir. Avcılardan veya ani rahatsızlıklardan kaynaklanan tehlike algılandığında, bireyler arasındaki mesafe hızla azalır ve koyunlar güvenlik için sıkıca kümelenir. Bu davranış, türün evrimsel savunma stratejilerini yansıtır. Bu davranışa bencil sürü davranışı da denir çünkü mesafeyi azaltan davranış, her koyunun sürünün ortasında yer almaya çalışmasından kaynaklanmaktadır.</li></ul><p><b>Refah Değerlendirmesine Etkileri</b></p><ul><li><b>Duygusal Durum Göstergesi</b>: Grup içi yayılma veya sıkı kümelenme gözlemleri, invazif olmayan bir refah göstergesi olarak kullanılabilir. Tehlike ortamı olmadan sürekli bir arada kümelenme, aşırı kalabalık, kötü çevre koşulları veya sürekli tehdit gibi kronik stres göstergesi olabilir.</li><li><b>Kaynaklara Erişim ve Çevre Tasarımı</b>: Doğal alan davranışı, koyunların istedikleri zaman yakınlaşma ya da uzaklaşma tercihlerini yapabilmesinin önemini gösterir. Hareketi kısıtlayan veya zorla yakınlık yaratan ortamlar, doğal davranışların engellenmesine, artan agresyon ve strese yol açabilir.</li></ul></div>`,
        tooltip: 'More Information',
      },
    ],
  },
  {
    slug: 'koyunlarda-yaylim-4',
    title: 'Koyunlarda Yaylım - 4',
    Icon: Footprints,
    details: details,
    category: 'animal-husbandry',
    view360: {
      image: '/pictures/koyunlarda-yaylim-4.jpg',
    },
    audio: '/pictures/koyunlarda-yaylim-4.wav',
    markers: [
      {
        id: 'info-marker-7',
        longitude: 0.1833384884920191,
        latitude: -0.12414219894462386,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: black; background: white; border-radius: 0.5rem; font-family: sans-serif;"><p>Koyunlarda, tüm hayvanlarda olduğu gibi suya erişim hayvan refahı için kritik bir rol oynar. Koyunların günlük su ihtiyacı genellikle 4 ila 6 litre arasında değişir ve süt verme döneminde veya sıcak havalarda bu ihtiyaç artar. Su tüketimi, koyunun yaşı, üretim durumu, yediği yemin nem içeriği, ortam sıcaklığı ve nem gibi faktörlere bağlıdır. Örneğin, 4 ila 6 litre su içen koyunlar genellikle günlük 1.8 ila 2 kilogram kuru yem tüketirler. Süt veren koyunlar veya yavrulayanlar, büyüme ve süt üretimini desteklemek için normal su ihtiyacının iki katına kadar suya ihtiyaç duyabilirler.</p><p>Su kalitesi ve suyun kolay ulaşılabilir olması çok önemlidir çünkü kalitesiz su, tüketimi azaltabilir ve koyunların sağlığını ve performansını olumsuz etkileyebilir. Koyunlar, nemli otlar veya yüksek nem içerikli yemlerden bir miktar su alabilir, ancak tam hidrasyon için her zaman temiz ve taze suya erişimleri olmalıdır.</p><p>Sıcak iklimlerde veya sıcak stresi durumlarında su tüketimi artar. Gölge veya barınak sağlanması, sıcağın olumsuz etkilerini azaltarak su ihtiyacını düşürebilir. Ayrıca, su tüketimi koyun ırkına, çevresel koşullara ve yemleme şekline göre değişiklik gösterebilir. Koyunlar kuru yem (saman vb.) ile beslendiğinde, nemli yemlere göre (örneğin silaj) daha fazla su içerler.</p><p>Sonuç olarak, koyunların sağlığı, büyümesi, üremesi ve refahı için fizyolojik durumlarına ve çevresel koşullara uygun, sürekli erişilebilir temiz ve taze su sağlanması gereklidir</p></div>`,
        tooltip: 'More Information',
      },
      {
        id: 'info-marker-8',
        longitude: 3.7274295675912117,
        latitude: -0.3048893992857,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: black; background: white; border-radius: 0.5rem; font-family: sans-serif;"><p>Hayvanlara karşı riskli olabilecek fiziksel tehlike unsurlarının hayvanların bulunduğu alanlardan kaldırılması gerekir. Örneğin bu işletmede tam da barınak çıkışında yer alan tahta ve demir parçalar hayvanların hızlıca geçeceği bu alanda koyunları yaralayabilir.</p></div>`,
        tooltip: 'More Information',
      },
      {
        id: 'info-marker-9',
        longitude: 2.710078863526966,
        latitude: -0.07144318148674622,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: black; background: white; border-radius: 0.5rem; font-family: sans-serif;"><p>Burada çobanın şahsi ihtiyaçları için kurduğu yapıyı görüyorsunuz. Bir işletmeye hayvan refahını artırmak için bir öneride bulunmadan önce mevcut imkanları değerlendirmek için bu gibi ipuçlarını yakalamak daha etkili bir iletişim kurmak için çok önemlidir.</p></div>`,
        tooltip: 'More Information',
      },
    ],
  },
  {
    slug: 'koyunlarda-yaylim-5',
    title: 'Koyunlarda Yaylım - 5',
    Icon: Footprints,
    details: details,
    category: 'animal-husbandry',
    view360: {
      image: '/pictures/koyunlarda-yaylim-5.jpg',
    },
    audio: '/pictures/koyunlarda-yaylim-5.wav',
    markers: [
      {
        id: 'info-marker-10',
        longitude: 2.7486920073552734,
        latitude: -0.025092182867660462,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: black; background: white; border-radius: 0.5rem; font-family: sans-serif;"><p>Anız terimi, tarımda hasat sonrası tarlada kalan birki salparı, kökler ve diğer kalıntılar için kullanılır. Anız toprağın nemini korumaya, erozyonu önlemeye yardımcı olabildiği gibi ruminantlar için bir besin kaynağı olabilirler. Ruminantlar anızla beslendikleri süre boyunca ürettikleri gübre ile toprağı zenginleştirir. Dolayısı ile tarımsal alanlarda yapılan küçük ruminant faaliyetleri iki taraf içinde kazançlıdır.</p></div>`,
        tooltip: 'More Information',
      },
      {
        id: 'info-marker-11',
        longitude: 3.8482448341890407,
        latitude: -0.2599678755522812,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: black; background: white; border-radius: 0.5rem; font-family: sans-serif;"><p>Yağlı kuyruklu koyun ırkları, dünyanın toplam koyun popülasyonunun yaklaşık dörtte birini oluşturur ve özellikle Afrika'nın kuzeyi, Orta Doğu ve Orta Asya'da yaygın olarak bulunur. Bu koyunların belirgin özelliği, kuyruk veya arka kısımlarında büyük yağ depolarının bulunmasıdır. Bu yağ depoları, bir deve hörgücü gibi, hayvanın kurak ve yetersiz besin koşullarında hayatta kalmasını sağlayan enerji rezervi işlevi görür.</p><h3>Türkiye'deki Önemli Yağlı Kuyruklu Koyun Irkları</h3><p>Türkiye'de yetiştirilen birçok koyun ırkı yağlı kuyrukludur. Bunlardan bazıları şunlardır:</p><ul><li><b>Akkaraman:</b> Türkiye'deki yerli koyun popülasyonunun büyük bir kısmını oluşturur. Orta Anadolu ve geçit bölgelerinde yaygın olarak yetiştirilir. Beyaz yapağılıdır ve burun, göz, kulak ve ayaklarında siyah lekeler bulunabilir.</li><li><b>İvesi:</b> Özellikle Güneydoğu Anadolu Bölgesi'nde yaygındır. Hem et hem de süt verimi yüksek bir ırktır. Erkekleri boynuzlu olabilir ve kuyruğu orta yağlıdır.</li><li><b>Dağlıç:</b> Orta ve Batı Anadolu'da yetiştirilen bir ırktır. Genel olarak et verimi için tercih edilir. Kuyruk yağlıdır ve kalp şeklinde aşağı doğru sarkar.</li><li><b>Morkaraman:</b> Doğu Anadolu'ya özgü, sağlam ve iri yapılı bir koyun ırkıdır. Kuyruğu yağlıdır ve Akkaraman'a göre daha büyüktür. Yapağısı kaba ve karışıktır, halı ve kilim üretimi için uygundur.</li></ul><h3>Yağlı Kuyruklu Koyunların Özellikleri</h3><p>Yağlı kuyruklu koyunlar, bu kendine özgü adaptasyonları sayesinde bazı avantajlara sahiptir:</p><ul><li><b>Kuraklığa ve zorlu koşullara dayanıklılık:</b> Kuyruklarında biriktirdikleri yağ, kuraklık veya kıtlık dönemlerinde enerji kaynağı olarak kullanılır. Bu sayede, zorlu iklim koşullarına kolayca adapte olabilirler.</li><li><b>Et kalitesi:</b> Kuyruk yağı, etin geri kalanına göre daha düşük erime noktasına sahiptir, bu da ona daha yumuşak ve tereyağına benzer bir doku kazandırır. Bu özellik, özellikle Orta Doğu ve Orta Asya mutfaklarında etin korunması ve yemeklere lezzet katması için kullanılır.</li><li><b>Yüksek adaptasyon yeteneği:</b> Bu ırklar genellikle bulundukları bölgenin sıcak ve kurak iklimine, uzun mesafelere yürümeye ve yetersiz beslenme şartlarına karşı oldukça dirençlidir.</li></ul><p>Yağlı kuyruklu koyunların bu eşsiz fizyolojik yapısı, onları binlerce yıldır çobanlık kültürlerinin ve ekonomilerinin önemli bir parçası haline getirmiştir.</p></div>`,
        tooltip: 'More Information',
      },
    ],
  },
  {
    slug: 'hayvan-pazari-1',
    title: 'Hayvan Pazarı - 1',
    Icon: Footprints,
    details: details,
    category: 'animal-trade',
    view360: {
      image: '/pictures/hayvan-pazari-1.jpg',
    },
    audio: '/pictures/hayvan-pazari-1.wav',
    markers: [
      {
        id: 'info-marker-12',
        longitude: 5.905518605273982,
        latitude: -0.09059302217140308,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: #000; background-color: #fff; border-radius: 0.5rem; font-family: sans-serif;">Pazardaki alıcıların ve satıcıların hayvanların içine girmeden hayvanları gözlemleyebilecekleri koridorlardan birisi. Bölmelerin etrafındaki metal bariyerler sayesinde insanlar burada güvenle dolaşabilirler.</div>`,
        tooltip: 'More Information',
      },
      {
        id: 'info-marker-13',
        longitude: 5.168471773895329,
        latitude: -0.07104546874113415,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: #000; background-color: #fff; border-radius: 0.5rem; font-family: sans-serif;"><p>Sığırların satılması amacıyla bağlandığı koridor. Buraya hayvanlar satıcıları tarafından başları insanların geçtiği koridora bakacak şekilde bağlanır. Hayvanlar bağlandığı için farklı grupların karışmasını engellemek için bölmelerin her tarafının kapalı olmasına ihtiyaç yoktur.</p></div>`,
        tooltip: 'More Information',
      },
      {
        id: 'info-marker-14',
        longitude: 4.321955826902132,
        latitude: 0.007851474419280358,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: #000; background-color: #fff; border-radius: 0.5rem; font-family: sans-serif;"><p>Hayvan yüklemek için platforma yanaşmış bir kamyonu ve bir ticari taksiyi görüyorsunuz. Her bölümü hayvan taşımacılğı için özel tasarlanmış büyük kamyonlardan, motorsikletlerin arkasında çekilen minyatür dorselere kadar hayvan taşımacılığı ile ilgili olan unsurların böylesine çeşitli olması, taşımacılığın gerek hastalıkların yayılmasında gerekse hayvan refahında ne kadar kritik bir role sahip olduğunu göstermektedir.</p></div>`,
        tooltip: 'More Information',
      },
    ],
  },
  {
    slug: 'hayvan-pazari-2',
    title: 'Hayvan Pazarı - 2',
    Icon: Footprints,
    details: details,
    category: 'animal-trade',
    view360: {
      image: '/pictures/hayvan-pazari-2.jpg',
    },
    audio: '/pictures/hayvan-pazari-2.wav',
    markers: [
      {
        id: 'info-marker-15',
        longitude: 5.695277775688081,
        latitude: 0.07951890690846031,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: #000; background-color: #fff; border-radius: 0.5rem; font-family: sans-serif;">
        <p>İçinden geçen araçlara yanlarından ve üstünden spreyleme yapan dezenfeksiyon tüneli. Ek bir gözlem olarak yerde dezenfektan su ile temas eden alanların diğer yerlere göre ne kadar deforme olduğunu gözlemleyebilirsiniz. Kullanılan dezenfektanların bertaraf edilmesi konusu çevre sağlığı için çok kritik öneme sahiptir. Neredeyse hiçbir dezenfektan doğada zararsız bir şekilde bozunmaz. Bunların uygun tesislerde gerekli işlemlerden geçirilerek bertaraf edilmesi gerekir.</p>
        </div>`,
        tooltip: 'More Information',
      },
      {
        id: 'info-marker-16',
        longitude: 3.011452523905368,
        latitude: -0.07899518818554929,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: #000; background-color: #fff; border-radius: 0.5rem; font-family: sans-serif;">
        <p>Burada hayvan pazarına girişte geçilen kontrol noktasını görüyorsunuz. Giren araçların taşıdıkları hayvan sayıları burada tespit edilerek gerekli ücret alınır. Pazar yerinin geliri, hayvan başına alınan bu giriş ücretinden gelir. Bu noktada ideal olarak her bir hayvanın sağlık kontrolünün yapılması gerekir ancak bunun için çok yüksek sayıda veteriner hekim istihdam edilmesi gerekir.</p>
        <p>Hayvan pazarları genelde günün çok erken saatlerinde, sabaha karşı 4-5 gibi açılırlar ve kısa bir zaman diliminde satıcıların hepsi pazara girmiş olur. Bu yüksek yoğunluklu giriş aktivitesinde 8-10 veteriner hekim bile mevcut olsa tüm hayvanları sağlık muayenesi yaparak kabul etmeye yetişemezler. Alım satım işlerinin çoğu sabah 8'den önce biter ve öğlene kadar kimse kalmaz. Bu zaman çizelgesi, yetiştiricilerin ne gibi zorluklarla bu işi yaptıklarını gösteren bir anekdottur.</p>
        </div>`,
        tooltip: 'More Information',
      },
    ],
  },
  {
    slug: 'hayvan-pazari-3',
    title: 'Hayvan Pazarı - 3',
    Icon: Footprints,
    details: details,
    category: 'animal-trade',
    view360: {
      image: '/pictures/hayvan-pazari-3.jpg',
    },
    audio: '/pictures/hayvan-pazari-3.wav',
    markers: [
      {
        id: 'info-marker-17',
        longitude: 4.709282630113098,
        latitude: -0.05853709479045932,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: #000; background-color: #fff; border-radius: 0.5rem; font-family: sans-serif;">
        <p>Hayvan yüklemek için ortak kullanımda olan bir yükleme rampası. Bunlar önemli kontaminasyon merkezleri olsalar da pazarın bu cephesine daha çok düşük profilli kamyonetlerin yaklaşması sebebi ile çok kullanılmıyor. Başka bir cephede platform ile yol arasındaki mesafenin fazla olması sebebi ile yüksek yükleme girişi olan kamyonlar da o taraftan platform kullanmadan yükleme yapabiliyorlar.</p>
        </div>`,
        tooltip: 'More Information',
      },
      {
        id: 'info-marker-18',
        longitude: 2.0636670208827397,
        latitude:  -0.15768920245283313,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: #000; background-color: #fff; border-radius: 0.5rem; font-family: sans-serif;">
        <p>Taşıdığı hayvan sayısına göre ödeme yaparak pazara girecek olan bir satıcı.</p>
        </div>`,
        tooltip: 'More Information',
      },
      {
        id: 'info-marker-19',
        longitude: 3.421738775914735,
        latitude: -0.07509986864483009,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: #000; background-color: #fff; border-radius: 0.5rem; font-family: sans-serif;">
        <p>Her büyüklükte araçla hayvan taşınabiliyor. Hayvan taşıyan aracın ve sürücüsünün özellikleri ile ilgili kanuni sınırlamalar sadece şehirler arası yolculuklarda geçerli olduğu için yerel tacirlerin hayvanların sahip oldukları herhangi bir araçla yaptıklarını görebilirsiniz.</p>
        </div>`,
        tooltip: 'More Information',
      },
    ],
  },
  {
    slug: 'hayvan-pazari-4',
    title: 'Hayvan Pazarı - 4',
    Icon: Footprints,
    details: details,
    category: 'animal-trade',
    view360: {
      image: '/pictures/hayvan-pazari-4.jpg',
    },
    audio: '/pictures/hayvan-pazari-4.wav',
    markers: [
      {
        id: 'info-marker-20',
        longitude: 5.175151097140476,
        latitude: -0.2802324850100302,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: #000; background-color: #fff; border-radius: 0.5rem; font-family: sans-serif;">
        <p>Bu pazarda küçükbaş hayvanlar için ayrılan bölümde bölmelerin etrafı kapalı ve bölmeler arasında alıcı ve satıcıların gezebilecekleri koridorlar mevcut. Bu bölmelerde koyunlar ve keçiler için bir ayrım söz konusu değil ancak bazı pazarlarda koyunların farklı, keçilerin farklı bölümlerde yer aldığını da görebilirsiniz.</p>
        </div>`,
        tooltip: 'More Information',
      },
      {
        id: 'info-marker-21',
        longitude: 3.7549242994844088,
        latitude:  -0.4342379180150884,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: #000; background-color: #fff; border-radius: 0.5rem; font-family: sans-serif;">
        <p>Bir hayvan pazarında el değiştiren hayvanlar zaman zaman alıcısı ile pazardan ayrılmaz, pazardan çıkana kadar bir çok kez el değiştirirler. Bu durumda hayvanlar pazarın içerisinde farklı noktalara taşınırlar, farklı bölmelere girer çıkarlar ve çok sayıda hayvana temas ederler. Bunlar hastalıkların yayılmasını şiddetlendiren unsurlar haline gelir.</p>
        </div>`,
        tooltip: 'More Information',
      },
    ],
  },
  {
    slug: 'hayvan-pazari-5',
    title: 'Hayvan Pazarı - 5',
    Icon: Footprints,
    details: details,
    category: 'animal-trade',
    view360: {
      image: '/pictures/hayvan-pazari-5.jpg',
    },
    audio: '/pictures/hayvan-pazari-5.wav',
    markers: [
      {
        id: 'info-marker-22',
        longitude: 4.820733671345822,
        latitude: -0.18342080158314666,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: #000; background-color: #fff; border-radius: 0.5rem; font-family: sans-serif;">
        <p>Hayvan pazarının her aktif gününün sonrasında detaylıca temizlenmesi gereklidir. </p>
        </div>`,
        tooltip: 'More Information',
      },
    ],
  },
  {
    slug: 'hayvan-pazari-6',
    title: 'Hayvan Pazarı - 6',
    Icon: Footprints,
    details: details,
    category: 'animal-trade',
    view360: {
      image: '/pictures/hayvan-pazari-6.jpg',
    },
    audio: '/pictures/hayvan-pazari-6.wav',
    markers: [
      {
        id: 'info-marker-23',
        longitude: 4.637658716944372,
        latitude: -0.23444305720870728,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: #000; background-color: #fff; border-radius: 0.5rem; font-family: sans-serif;">
        <p>Bu pazarda farklı yönlerde farklı yüksekliklerde platformlar olması ortak kullanıma açık yükleme rampalarına olan ihtiyacı ortadan kaldırarak araçların doğrudan platforma yaklaşmasına ve hayvanların düz bir yolda ilerleyerek araca yüklenebildikleri ve araçtan indirilebildiklerini görüyoruz. Araçtaki yükleme yüksekliği ve hayvanların kaynak veya hedef noktalarındaki yükseklik farklılıkları hayvanlar için çok önemli stres kaynaklarıdır. Burada görülen çözüm sadece hayvan pazarları değil, işletmeler için de örnek olabilecek bir sistemdir.</p>
        </div>`,
        tooltip: 'More Information',
      },
      {
        id: 'info-marker-24',
        longitude: 0.3599403911800256,
        latitude: -0.5859390232244981,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: #000; background-color: #fff; border-radius: 0.5rem; font-family: sans-serif;">
        <p>Bu kamyonete yüklenmiş farklı türlerde ve farklı ırklarda hayvanları görmekteyiz. Damızlık olarak veya uzun süreli bir planla hayvan alan bir işletmenin aynı tür ve ırktan hayvanlar alması beklenir. Burada gördüğümüz durum daha çok oportunistik bir alışverişe işaret etmekte ve bu hayvanlar büyük ihtimalle haftanın takip eden günlerinde başak bir hayvan pazarında tekrar satışa çıkacaklar. Bu şekilde yapılan alışverişlerde hayvanların 3 haftalı kbir karantinaya girmeden sürüye katılmaması çok önemlidir çünkü bu hayvanların bu pazara gelmeden önce ne kadar süredir farklı işletmeler arasında alınıp satıldığını bilemezsiniz.</p>
        </div>`,
        tooltip: 'More Information',
      },
      {
        id: 'info-marker-25',
        longitude: 4.918298211550219,
        latitude: -0.5433542136786906,
        image: '/pictures/i.png',
        width: 32,
        height: 32,
        anchor: 'center center',
        content: `<div style="max-width: 640px; padding: 1rem; color: #000; background-color: #fff; border-radius: 0.5rem; font-family: sans-serif;">
        <p>Burada pazar dağıldıktan sonra boş kalmış bir kamyon görüyoruz. Büyük ihtimalle hayvanlarını pazara getirmi şve başarıyla satmış bir satıcının kamyonu ve zeminin temiz olmasını bekleyemeyiz. Eğer boş gelmiş ve yeni hayvan alacak bir araç olsaydı tertemiz olmasını beklerdik. Ancak burada dikkat çeken başka bir nokta var. Zeminde görülen şey sadece hayvan dışkısı değil, boş miktarda toprak var. Bazı taşıyıcıların hayvanların konforunu sağlamak için kamyonun zeminine toprak döktüğü görülmektedir. Bu durum kendi başına kulağa pozitif bir durum olarak gelebilir ancak bu toprak, farklı hayvanları taşırken hastalıkları da beraberinde taşıyan yeni bir ortam yaratır. Bu uygulamayı genelde kendi işletmesinin hayvanlarını kendi aracı ile taşıyan taşıyıcılarda gördüğümüz için en büyük problemler arasında yer almayabilir ancak her zaman dikkat edilmesi ve uygulayanların uyarılması gereken bir konudur.</p>
        </div>`,
        tooltip: 'More Information',
      },
    ],
  },
  {
    slug: 'koyun-barinak-1',
    title: 'Koyun barınakları - 1',
    Icon: Footprints,
    details: details,
    category: 'animal-barn',
    view360: {
      image: '/pictures/koyun-barinak-1.jpg',
    },
    audio: '/pictures/koyun-barinak-1.wav',
  },
  {
    slug: 'koyun-barinak-2',
    title: 'Koyun barınakları - 2',
    Icon: Footprints,
    details: details,
    category: 'animal-barn',
    view360: {
      image: '/pictures/koyun-barinak-2.jpg',
    },
    audio: '/pictures/koyun-barinak-2.wav',
  },
];
