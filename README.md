<p align="center">
  <img src="icon128.png" alt="Euro Quick Quote" width="100"/>
</p>

<h1 align="center">Euro Quick Quote</h1>

<p align="center">
  <strong>Quick European stock quotes from Euronext, Xetra, BME and more. Right in your browser.</strong>
</p>

<p align="center">
  <a href="#-about">About</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-features">Features</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-installation">Installation</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-how-to-use">How to Use</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-privacy">Privacy</a>
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-3B82F6">
  <img alt="Version" src="https://img.shields.io/badge/version-2.0.0-3B82F6">
  <img alt="Chrome" src="https://img.shields.io/badge/Chrome-Extension-3B82F6?logo=googlechrome&logoColor=white">
  <img alt="Europe" src="https://img.shields.io/badge/Euronext-Xetra-FFCC00">
</p>

---

## 🎯 About

**Euro Quick Quote** is a Chrome extension that allows you to check stock quotes from European markets quickly and easily, without opening heavy websites or logging into trading platforms.

Supports major European exchanges including:
- 🇵🇹 **Euronext Lisboa** (Portugal)
- 🇫🇷 **Euronext Paris** (France)
- 🇳🇱 **Euronext Amsterdam** (Netherlands)
- 🇩🇪 **Xetra** (Germany)
- 🇪🇸 **Bolsa de Madrid** (Spain)
- 🇮🇹 **Borsa Italiana** (Italy)
- 🇧🇪 **Euronext Brussels** (Belgium)

Perfect for investors who want to track European markets efficiently, directly from their browser.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Ticker Search** | Enter the stock code with exchange suffix (e.g., GALP.LS, SAP.DE, ASML.AS) |
| 💰 **Real-Time Price** | View current price, percentage change, and change in EUR (or local currency) |
| 📊 **Daily Data** | Opening price, day high, day low, and trading volume |
| 📈 **Top 3 Gainers** | See the top 3 biggest gainers of the day for European stocks and ETFs |
| 📉 **Top 3 Losers** | See the top 3 biggest losers of the day for European stocks and ETFs |
| 🔄 **Auto Refresh** | Quotes automatically update every 30 seconds |
| 💾 **Last Ticker Memory** | The extension remembers the last asset you searched |
| 🇪🇺 **Multi-Currency** | Supports EUR, GBP, CHF, SEK, NOK, DKK, PLN and more |

---

## 🏛️ Supported Exchanges

| Exchange | Suffix | Example |
|----------|--------|---------|
| Euronext Lisboa (Portugal) | `.LS` | GALP.LS, EDP.LS |
| Euronext Paris (France) | `.PA` | TTE.PA, AIR.PA |
| Euronext Amsterdam (Netherlands) | `.AS` | ASML.AS, SHELL.AS |
| Xetra (Germany) | `.DE` | SAP.DE, SIE.DE |
| Bolsa de Madrid (Spain) | `.MC` | SAN.MC, TEF.MC |
| Borsa Italiana (Italy) | `.MI` | ENI.MI, ENEL.MI |
| Euronext Brussels (Belgium) | `.BR` | ABI.BR, KBC.BR |

---

## 📊 Monitored Assets

The extension monitors a curated list of liquid European assets for Top 3 calculation:

**Portugal (.LS):** GALP, EDP, EDPR, JMT, BCP, NOS, SON, CTT, ALTR, SEM

**France (.PA):** TTE, AIR, SAN, OR, MC, BNP, AI, CS, DG, CAP

**Netherlands (.AS):** ASML, SHELL, UNA, INGA, PHIA, HEIA, AD, WKL

**Germany (.DE):** SAP, SIE, ALV, MBG, BMW, DTE, BAS, MUV2, VOW3

**Spain (.MC):** SAN, IBE, TEF, ITX, REP, BBVA, CABK, FER

**European ETFs:** VEUR.AS, IEUR.AS, EXW1.DE, MEUD.PA, PSI20.LS, CAC.PA, DAX.DE, IBEX.MC

---

## 🚀 Installation

### From Source (Developer Mode)

1. **Clone or download** this repository:
```bash
git clone https://github.com/eltonsantos/euro-quick-quote.git
```

2. Open Chrome and go to `chrome://extensions/`

3. Enable **Developer mode** (toggle in the top-right corner)

4. Click **"Load unpacked"** and select the project folder

5. The extension icon will appear in your toolbar — you're ready to go!

---

## 💡 How to Use

1. Click the **Euro Quick Quote** icon in your Chrome toolbar

2. Enter the asset code with the exchange suffix in the search field:
   - `GALP.LS` - Galp Energia (Portugal)
   - `ASML.AS` - ASML (Netherlands)
   - `SAP.DE` - SAP (Germany)
   - `SAN.MC` - Banco Santander (Spain)

3. Click **Search** or press **Enter**

4. The quote will be displayed with:
   - Current price in the local currency (EUR, etc.)
   - Percentage and absolute change
   - Opening, high, low, and volume data
   - Exchange name

5. To see the top gainers and losers of the day, click **Load** in the "Top 3" section

6. Use the **Refresh** button for manual update, or wait for auto-refresh (30s)

---

## 🖼️ Screenshot

<p align="center">
  <img alt="Euro Quick Quote Popup" src=".github/screenshot.png" width="400px">
</p>

---

## 🧪 Technologies

This extension was built with:

- **JavaScript** (Vanilla JS, no frameworks)
- **Chrome Extensions API** (Manifest V3)
- **CSS3** (Custom styling with CSS variables)
- **Yahoo Finance API** (Quote data source - no API key required)
- **Chrome Storage API** (Local preference storage)

---

## 🔒 Privacy

Your privacy matters. This extension:

- ✅ Does **NOT** collect personal data
- ✅ Does **NOT** track your browsing history
- ✅ Does **NOT** send data to external servers (except Yahoo Finance for quotes)
- ✅ Works **100% locally** in your browser
- ✅ Only accesses Yahoo Finance API to fetch quotes

All settings are stored locally using Chrome Storage.

Read the [full Privacy Policy](PRIVACY.md).

---

## 📋 Changelog

### v2.0.0
- 🇪🇺 **Major update: European markets support**
- Switched from Stooq API to Yahoo Finance API
- Added support for Euronext (Portugal, France, Netherlands, Belgium)
- Added support for Xetra (Germany), BME (Spain), Borsa Italiana (Italy)
- Multi-currency support (EUR, GBP, CHF, etc.)
- Updated UI with exchange suffix guide
- European stocks and ETFs for Top 3 feature

### v1.0.0
- 🎉 Initial release (US markets - NYSE/NASDAQ)
- Ticker quote search
- Display of price, change, open, high, low, and volume
- Top 3 gainers and losers (Stocks and REITs)
- Auto-refresh every 15 seconds
- Last searched ticker memory

---

## 🐾 Next Steps

- [ ] Publish to Chrome Web Store
- [ ] Add favorites/watchlist feature
- [ ] Price alert notifications
- [ ] Simplified intraday chart
- [ ] Support for more exchanges (London, Zurich, etc.)
- [ ] Firefox and Edge compatibility

---

## 👨🏻‍💻 Author

<h3 align="center">
  <img style="border-radius: 50%" src="https://avatars3.githubusercontent.com/u/1292594?s=460&u=0b1bfb0fc81256c59dc33f31ce344231bd5a5286&v=4" width="100px;" alt="Elton Santos"/>
  <br/>
  <strong>Elton Santos</strong> 🚀
  <br/>
  <br/>

  <a href="https://www.linkedin.com/in/eltonmelosantos" alt="LinkedIn" target="blank">
    <img src="https://img.shields.io/badge/-LinkedIn-blue?style=flat-square&logo=Linkedin&logoColor=white" />
  </a>

  <a href="https://github.com/eltonsantos" alt="GitHub" target="blank">
    <img src="https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=GitHub&logoColor=white" />
  </a>

  <a href="https://www.youtube.com/@eltonsantosoficial" alt="YouTube" target="blank">
    <img src="https://img.shields.io/badge/-YouTube-ff0000?style=flat-square&logo=YouTube&logoColor=white" />
  </a>

  <a href="mailto:elton.melo.santos@gmail.com?subject=Hello%20Elton" alt="Email" target="blank">
    <img src="https://img.shields.io/badge/-Gmail-c14438?style=flat-square&logo=Gmail&logoColor=white" />
  </a>

  <a href="https://eltonmelosantos.com.br" alt="Website" target="blank">
    <img src="https://img.shields.io/badge/-Website-3B82F6?style=flat-square&logo=Safari&logoColor=white" />
  </a>

<br/>
<br/>

Made with ❤️ by Elton Santos 👋🏽 [Get in touch!](https://www.linkedin.com/in/eltonmelosantos/)

</h3>

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

This extension is for informational purposes only. Quotes are obtained from Yahoo Finance and may be delayed. It does not constitute investment advice. Always consult a professional before making investment decisions.
