# Orman Yangını Simülatörü (Forest Fire Simulator)

Bu proje, bir web tarayıcısı üzerinden çalışan, **hücresel otomat (cellular automata)** mantığına dayanan etkileşimli bir Orman Yangını Simülatörüdür. Simülasyonun çekirdek mekanikleri **Rust** kullanılarak geliştirilmiş ve yüksek performanslı çalışabilmesi için **WebAssembly (WASM)** olarak derlenmiştir. Görselleştirme ise HTML5 Canvas kullanılarak tarayıcı ekranına yansıtılmaktadır. Ek olarak, bir PWA (Progressive Web App) olarak yapılandırıldığı için uyumlu cihazlarda doğrudan ana ekrana yüklenebilir.

---

## Simülasyon Mantığı ve Hücre Durumları

Simülasyon, her pikselin bir hücreyi temsil ettiği **960x540** çözünürlüğünde bir ızgara (grid) üzerinde çalışır. Her bir hücre aşağıdaki 4 farklı durumdan birinde bulunabilir:

- **Boş (Empty - Siyah):** Üzerinde ağaç olmayan ve yanmaya müsait olmayan alan.
- **Ağaç (Tree - Yeşil):** Ormanı oluşturan ve potansiyel olarak yanabilecek alan.
- **Ateş (Fire - Turuncu/Kırmızı):** Aktif olarak yanan ağaç hücresi.
- **Yanmış (Burnt - Koyu Gri):** Yangından sonra geriye kalan kül alanı. Belirlenen bir "soğuma süresi" boyunca bu alanda yeni bir ağaç yetişemez.

---

## Simülasyon Dinamikleri (Zaman Adımları / Tick)

Simülasyonun her bir karesi (frame) oluşturulurken 3 temel aşama işlenir:

### 1. Yangının Yayılımı (Propagation)
Hücrelerin kendi çevreleriyle olan etkileşimi incelenir. 
- Bir **Ağaç** hücresinin etrafındaki **5x5'lik alan** (merkezden itibaren her yöne en fazla 2 birim uzaklık) taranır. Eğer bu komşuluk içerisinde en az bir adet Ateş hücresi tespit edilirse, ağaç hücresi de tutuşur ve bir sonraki adımda **Ateş** durumuna geçer.
- Bir **Ateş** hücresi, görevini tamamladıktan hemen sonraki adımda **Yanmış** durumuna döner. (Bir hücre aktif olarak çok kısa bir süre yanar, çevreye sıçradıktan sonra söner).
- Bir **Yanmış** hücre, kullanıcı tarafından belirlenen Soğuma Süresini (Regrowth Delay) doldurduğunda küllerinden arınır ve tekrar ağaç yetişebilecek **Boş** bir hücre haline gelir.

### 2. Ağaçların Büyümesi (Growth)
Ağaçların çoğalması **yalnızca haritada hiç aktif yangın olmadığında** gerçekleşir. Eğer ufak da olsa bir yangın devam ediyorsa orman kendini yenilemeyi durdurur.
- Büyüme hızı, saniyede kaç ağaç filizleneceğini belirleyen bir parametre ile kontrol edilir.
- Ağaç filizlenmesi rastgele noktalarda gerçekleşir ancak **doğal kümelenme** algoritmalarıyla desteklenir:
  - Seçilen rastgele noktanın **3x3'lük alanında** (hemen bitişiğindeki) başka bir ağaç varsa, yeni ağacın oraya tutunma ve çıkma ihtimali **%100**'dür.
  - Eğer etrafında hiç ağaç yoksa, tohumun ıssız bir yerde filizlenme şansı sadece **%5**'tir.
  Bu kural, ormanın tamamen rastgele gürültü (noise) şeklinde değil, birbirine bitişik, gerçekçi kümelenmeler halinde büyümesini sağlar.

### 3. Yangının Tetiklenmesi (Ignition)
Simülasyonda doğa olaylarını taklit eden iki farklı yangın başlangıç metodu vardır:
- **Yoğunluk Tetikleyicisi (Density Trigger):** Haritadaki toplam ağaç oranının belirlenen eşik yüzdesini (Fire Trigger %) aşması durumunda, algılayıcılar tetiklenir ve rastgele bir ağaç anında tutuşur. Yoğun bir ormanın bir noktada kesinlikle yanacağı prensibine dayanır.
- **Yıldırım Düşmesi (Lightning Timer):** Ormanın ne kadar yoğun olduğundan bağımsız olarak, belirlenen saniye aralıklarında (Lightning Timer) simülasyona yıldırım düşer ve haritadaki rastgele bir ağacı tutuşturarak yangın başlatır.

---

## Kullanıcı Arayüzü ve Kontroller (UI)

Simülasyon sayfasında, modeli canlı olarak manipüle edebileceğiniz bazı sürgüler (slider) bulunur:

- **Growth Speed (Trees/sec):** Ormanın yenilenme hızını ayarlar. Saniyede 1 ağaç ile 10.000 ağaç arasında üretim yapılmasını sağlar.
- **Regrowth Delay (seconds):** Yanan bir orman bölgesinin tekrar yeşerebilmesi için gereken minimum süreyi saniye cinsinden kontrol eder (0 ile 1000 saniye arası).
- **Fire Trigger (Density %):** Ormanın yüzde kaçı ağaçla kaplandığında otomatik yoğunluk yangınının çıkacağını belirtir (%1 - %100 arası).
- **Lightning Timer (sec):** Ormana rastgele düşecek olan yıldırımların saniye cinsinden periyot aralığıdır.

**Düğmeler:**
- **Fullscreen (⛶):** Canvas'ı büyüterek tarayıcıda tam ekran moduna geçer.
- **Reset:** Tüm haritayı temizler ve simülasyonu ilk boş anına döndürür.

---

## Teknik Altyapı ve Mimarisi

- **WebAssembly & Rust:** Modelin ağır matematiksel işlemleri, komşuluk hesaplamaları ve şans faktörü üreten rastgelelik algoritmaları (PRNG) tamamen Rust'ta (`src/lib.rs`) kaleme alınmıştır. Rust, projeyi `pkg` klasöründe bir WebAssembly ve JavaScript entegrasyon dosyasına derler. Bu sayede simülasyon, bir JavaScript döngüsünde yaşayabileceği yavaşlamalar olmadan yüksek performansla (FPS) çalışır.
- **Canvas Rendering:** Elde edilen veriler her adımda HTML tarafındaki `index.html` içinde yer alan `requestAnimationFrame` döngüsüne aktarılır. Hücreler byte array'ler olarak direkt Canvas `ImageData`sına dönüştürülerek boyanır.
- **Progressive Web App (PWA):** `manifest.json` ve `sw.js` service worker dosyaları ile cihazlara yüklenebilir hale getirilmiştir. Cihaza indirildikten sonra internet olmadan da kusursuz şekilde çalışır.
