# EPIX - Livestock Disease Pathway Simulation (SEIRS)

EPIX, hücresel otomat (cellular automata) ve etmen-tabanlı (agent-based) modellemenin birleşimini kullanan, uzamsal ve stokastik bir hayvansal hastalık yayılım simülatörüdür. Bu simülatör, tarımsal ve hayvansal popülasyonlarda bulaşıcı bir hastalığın S.E.I.R.S. modeli (Susceptible - Exposed - Infectious - Recovered - Susceptible) kullanılarak nasıl yayıldığını ve farklı lojistik/müdahale faktörlerinin salgını nasıl etkilediğini analiz etmek için tasarlanmıştır.

## 1. Temel Epidemiyolojik Model (S.E.I.R.S.)

Simülasyondaki her bir hayvan (piksel/nokta) belirli bir anda aşağıdaki 6 durumdan birinde bulunabilir.

| Durum (Renk) | İngilizce Karşılığı | Açıklama |
| :--- | :--- | :--- |
| **Duyarlı (Yeşil)** | Susceptible | Tamamen sağlıklı ve hastalığa yakalanmaya açık (risk altında) popülasyon. |
| **Maruz Kalmış (Turuncu)** | Exposed | Hastalık etkenini almış, virüsü kuluçka döneminde barındıran ancak henüz çevresine virüs yaymayan (shedding olmayan) hayvanlar. |
| **Bulaştırıcı (Sarı)** | Infectious | Kuluçka süresini atlatmış, aktif olarak hasta olan ve etrafındaki (ya da lojistik ağındaki) diğer hayvanlara virüs yayan popülasyon. |
| **Bağışık/İyileşmiş (Mavi)** | Recovered / Immune | Hastalığı atlatmış ve geçici bir süre için antikor geliştirerek hastalığa karşı koruma sağlamış olan hayvanlar. |
| **Aşılı (Koyu Yeşil)** | Vaccinated | Kullanıcı müdahalesi ile aşılanmış, hastalanma olasılığı ve ölümcül etkileri büyük oranda düşürülmüş hayvanlar. |
| **Ölü / İtlaf Edilmiş (Kırmızı)** | Dead / Removed | Hastalık sebebiyle ölen veya salgını durdurmak için kullanıcı/otorite tarafından itlaf edilen (Cull) hayvanlar. |

## 2. Dinamik Ağ Modeli ve Lojistik (Transport)

Salgın sadece yan yana duran hayvanlar arasında değil, metapopülasyonlar (şehirler/çiftlikler) arası nakliye ağlarıyla da taşınır. Bu taşıma işlemini **Mobil Etmenler (Kamyonlar - Trucks)** sağlar.

*   **Döngü İşleyişi:** Bir kamyon "A" şehrinden bir hayvan/sürü durumu alır -> Şehirde 5 saniye bekleyip yükleme/karışma yapar -> Bağlantı yollarından ilerler -> "B" şehrine varır -> Orada da 5 saniye bekler.
*   **Etkileşim:** Kamyon şehirde beklediği süre boyunca o şehirdeki hayvanların geçici bir "komşusu" sayılır. Eğer kamyon enfekte (Sarı) bir hayvan taşıyorsa, vardığı şehirdeki sağlıklı hayvanları enfekte edebilir. Aynı şekilde eğer kamyon sağlıklıysa, vardığı enfekte bir şehirden virüsü kapıp geldiği yere taşıyabilir.
*   **Transport Ban (Nakliye Yasağı):** Arayüzden `Transport` düğmesi kapatıldığında tüm ağ durur, kamyonlar ortadan kaybolur ve şehirler arası yapay temas kesilmiş olur.

## 3. Matematiksel Altyapı ve Formüller

Simülatör, zamanın (ticks) ve olayların olasılıksal doğasını (stochastic) yönetir.

*   **Enfeksiyon Gücü (Force of Infection):** Bir hayvanın hasta olma olasılığı şu formülle hesaplanır:
    `P(infection) = 1 - (1 - β)^n`
    *(Burada `β` bulaşma oranı, `n` ise etrafındaki enfekte hayvan/kamyon sayısıdır. Yoğunluğa bağlı bulaşmayı doğal olarak hesaba katar.)*
*   **Rt (Reproduction Number):** Ekranda anlık olarak gösterilen R0 (Rt) değeri, aktif bir bulaştırıcının ortalama kaç ikincil enfeksiyona yol açtığını gerçek zamanlı olarak ölçer ve salgının büyüme veya sönme eğiliminde olduğunu belirtir.
*   **Zaman Ölçeği:** Simülasyon zamanı "1x" (Gerçek zaman) ile "1000x" (Aşırı hızlandırılmış) arasında logaritmik olarak kaydırıcı (slider) ile kontrol edilebilir.

---

## 4. Kullanıcı Kontrolleri ve Parametreler

Arayüzdeki (Sol Üst Köşedeki `⚙` dişli ikonu) ayarlar üzerinden tüm parametrelerin varsayılan, minimum ve maksimum değerleriyle oynanabilir. Değerlerin etkileri anında simülasyona yansır.

### A. S.E.I.R.S. Parametreleri (Hastalık Özellikleri)

| Parametre Adı | Varsayılan | Min | Max | Etkisi |
| :--- | :--- | :--- | :--- | :--- |
| **Latency Period (Kuluçka Süresi)** | 2 gün | 0 | 60 | Virüsü alan bir hayvanın (Turuncu) etrafa yaymaya (Sarı) başlayana kadar geçen sessiz süre. |
| **Infectious Period (Hastalık Süresi)** | 5 gün | 0 | 60 | Hayvanın sarı kalarak çevresine virüs yaydığı aktif enfeksiyon süresi. Bu süre dolduğunda hayvan ya ölür ya iyileşir. |
| **Immunity Duration (Bağışıklık Süresi)** | 10 gün | 0 | 1000 | İyileşen (Mavi) veya Aşılı olan hayvanın tekrar sağlıklı (Yeşil) hale dönüp enfeksiyona açık olmadan önce korunduğu süre. |
| **Mortality Rate (Ölüm Oranı)** | %10 | %0 | %100 | Hastalık süresini tamamlayan sarı hayvanların ölme (Kırmızı olma) ihtimali. |
| **Replacement Time (Yerine Koyma Süresi)** | 2 gün | 0 | 60 | Ölen hayvanların yerine yenilerinin (sağlıklı yavruların/satın alımların) getirilme hızı. |
| **Cull Replace Time (İtlaf Telafi Süresi)** | 30 gün | 0 | 120 | Salgını engellemek için isteyerek itlaf edilen hayvanların yerine yenilerinin getirilmesi (karantina boşluğu vb. sebebiyle daha uzundur). |

### B. Aşı Verimliliği (Vaccination Efficiency)

| Parametre Adı | Varsayılan | Min | Max | Etkisi |
| :--- | :--- | :--- | :--- | :--- |
| **Vaccine Morbidity Factor** | %1 | %0 | %100 | Aşılı bir hayvanın, aşısız bir hayvana göre hastalığa yakalanma oranı. (Örn: %1 ise aşı %99 koruma sağlıyor demektir). |
| **Vaccine Mortality Factor** | %10 | %0 | %100 | Aşılı olup da hastalığa yakalanan (Breakthrough) hayvanın ölüm oranının düşürülmesi. (Normal ölüm %10 ise ve bu faktör %10 ise, aşılı hastanın ölme ihtimali %1'e düşer). |

### C. Bulaşma Oranları (Transmission Rates)

| Parametre Adı | Varsayılan | Min | Max | Etkisi |
| :--- | :--- | :--- | :--- | :--- |
| **Close Contact (Yakın Temas)** | %20.00 | %0 | %100 | Hemen yanındaki (komşu piksellerdeki) hayvanlara veya aynı şehirdeki kamyonlara bulaşma ihtimali. |
| **Medium Range (Hava Yolu/Orta Mesafe)** | %0.50 | %0 | %100 | Rüzgar, toz vb. yollarla 10-100 piksel uzaklıktaki sürülere sıçrama ihtimali. |
| **Long Range (Vektörel/Uzak Mesafe)** | %0.01 | %0 | %100 | Kuşlar, sinekler veya bilinmeyen taşıyıcılarla haritanın rastgele herhangi bir noktasına atlama ihtimali. |

### D. Lojistik ve Ağ Ayarları

| Parametre Adı | Varsayılan | Min | Max | Etkisi |
| :--- | :--- | :--- | :--- | :--- |
| **Transport Density (Kamyon Sayısı)** | 20 Kamyon | 0 | 200 | Ağ üzerinde dolaşan kamyon sayısı. Sayı arttıkça şehirler arası bulaş ihtimali logaritmik olarak artar. |

---

## 5. Müdahale Araçları (Toolbox)

Ekranın alt orta kısmında bulunan araç kutusu, simülasyona gerçek zamanlı olarak müdahale etmenizi sağlar:

1.  **Infect (Enfekte Et - ☣):** Farenizle tıkladığınız veya sürüklediğiniz bölgedeki hayvanlara doğrudan hastalığı (Turuncu/Latent fazı) bulaştırırsınız. "Sıfırıncı Hasta"yı yaratmak için kullanılır.
2.  **Cull (İtlaf Et - ☠):** Büyük bir yarıçap içerisindeki hastalık şüphesi olan hayvanları anında itlaf ederek kırmızıya boyar. Salgının yayılmasını engellemek için kullanılan radikal bir bariyer yöntemidir (Ring culling).
3.  **Vaccine (Aşıla - 💉):** Tıkladığınız bölgedeki sağlıklı hayvanlara anında aşı uygular (Koyu Yeşil). Yanında bulunan minik "All" butonuna tıklarsanız haritadaki tüm sağlıklı hayvanlar aynı anda aşılanır.
4.  **Lasso (Kement - 🔍):** Farenizle harita üzerinde serbest bir alan çizersiniz. Çizdiğiniz alan birleştiğinde sol üstte özel bir panel açılır ve **sadece çizdiğiniz bölgenin içerisindeki** sağlıklı, hasta, ölü vb. demografik verileri gösterir. Yerel popülasyon (Local Census) istatistikleri için kusursuzdur.
5.  **Reset (Sıfırla - 🔄):** Haritayı ve nüfusu sabit tutarak tüm hastalık parametrelerini temizler ve herkesi tekrar "Yeşil" (Sağlıklı) duruma getirir. (*Not: Haritadaki şehir yapısını baştan yaratmak isterseniz "Regenerate Map" butonunu kullanmalısınız.*)

## 6. Teknik Mimari

*   **Tamamen İstemci Taraflı (Client-Side):** Arka uç (backend) sunucusuna ihtiyaç duymaz. Tamamı HTML5, JavaScript (Vanilla) ve Canvas API kullanılarak inşa edilmiştir.
*   **PWA Uyumluluğu:** Uygulama `manifest.json` ve `sw.js` dosyalarını içerir. Bu sayede tarayıcınızın adres çubuğundan yerel bir uygulama gibi yüklenebilir ve çevrimdışı (offline) çalışabilir.
*   **Optimizasyon:** Hayvan verileri `Uint8Array` ve `Uint32Array` gibi düşük seviye veri yapılarıyla tutulur, bu sayede saniyede 60 kare hızında on binlerce piksel hesaplanabilir. Ekrana yazdırma (Render) aşamasında Canvas `ImageData` kullanılarak en yüksek performans sağlanmıştır.
