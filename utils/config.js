const properties = {}
const developDB = 'ZRJeQVex+KtMMKM92dmeCCon/kVNYp2Xu+tWMPJc7e1IWK30D5/C+idwcRMacGTF9+v4Aca+PhVciP8ioWghXNEt71OfgQgul4/hx4NTmwoS2DOfu+3Qa7oitKfbijeTcN9fXS+teynRPcQqej4tI2pfTOebRRrtMEsniumTC9Q='
const productDB = 'D1DIzC7hy8ujX7stwR/WImulVTWIe6FS4GCOTNmSXDCV5Pzii/IgjNlGXh36KWIAztwHASgvJ3/5qwZ5T8aGaqvOAOsKKCVM1FzADhHlBRkdpubkgzoBw9d205mYQohUBBvUtUCQfaNL5cRUNOI5gvlJKAp8/FiDD+utt5fpuxw='
properties.dbConfig  = {
  host: 'cDyv1Mwn+/pIexoP0nuY+/iudYEoT83CUKG/HB5+vQWj9lN1Z1prZSH2TivTWV7BqmGBDUMGPGQaLw9WGqEhUrrYsuO1OS2OS7jI0Q2wS1X+nvLMN/9IPPiSYot8ayFBDMpYAukjflvOBX01xgGzgdH7kiv/6w+3g9nu0+C+5eo=',
  user: 'R/17/Ky+Tzv4ZVtZSGrUNlRxcEs0Q82iNnNag6shPyezs9EE7ZIT9UQKrZ61JWa/VZd3sBTGJ/wd+raRGU0dVK9Qm+mCrCDn0AIswVW5hLi2ghYbbZI6EBGJHY/hwweyiZ847pEvZEtHNb9S/pE9q2FJBhtBbO/Lwgwou+fuORg=',
  password: 'LCetpLvT6PLVOOhSXc4IU8H245CihVVsXnRYsGRQUiyBNx6zuvl2XkC9W7YLsqkjvUfZpeTA6Miel7wzzE04B0cUPcgotnxP7Oeik2S+qz9EZMU92lWoIBb4HYl7EFg9g8zhpg1Ha2JePnkmvVkpkZoGtxMmD4b2ZIuO3OWXhwE=',
  //database: 'D1DIzC7hy8ujX7stwR/WImulVTWIe6FS4GCOTNmSXDCV5Pzii/IgjNlGXh36KWIAztwHASgvJ3/5qwZ5T8aGaqvOAOsKKCVM1FzADhHlBRkdpubkgzoBw9d205mYQohUBBvUtUCQfaNL5cRUNOI5gvlJKAp8/FiDD+utt5fpuxw='
  database: process.env.NODE_ENV === 'development' ? developDB : productDB,
  // database: productDB,
}
properties.senderConfig = {
  user: 'bfwXFeKyzi/F9rExK8oDyj2YQC7tlRz5ylbffAryefVz7SEwivCQrLgemyp7a6dm6ky2IFbCFD3xjiNmsl8mnk9WMhJyGRyzxZJiBwE63HNI7EGoI+78e1X95CXs7kw2kkj5geiZYktkuIpOxL0CaM8Xi5OsEHv0wyG+jFH2IOM=',
  pass: 'GUFrY2+h+as6HC04qiQRQMpS1se/F5S/7cFKDNM7w58zT4LT1Wc+wi/SiN1euAixAkwHpGEDFdadPei5g9o8vCXr75+GaXm4VO1AT6hrxJWKiYs5IlIZAmq1/1HNq9mC63wW624X58eFs2BvFNfLUxjnDkdBrqmENvvf5KSwP7M='
}
module.exports = properties;
