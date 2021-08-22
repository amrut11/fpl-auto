const request = require('request');

const COOKIE = 'idp_locale=en; geo.Country={"countryName":"India","countryCode":"IND","countryCodeShort":"IN","fifaCountryCode":"IND","uefaCountry":false}; gig_bootstrap_3_goMvlNo1VWX5L5utb5xemUCFy1qmn0rJWb_JLrDwznqr7WUmg_FhjxGhLzl1Jpwv=idp_ver4; OptanonAlertBoxClosed=2021-05-12T05:53:08.634Z; _scid=56ce9fd3-b1cb-4d28-ab07-337d4777d46c; _fbp=fb.1.1620798789124.1132970743; _sctr=1|1620757800000; BCSessionID=4278ea40-513e-45a7-8b41-ec5ac9ee4fa8; __gads=ID=bae8a6f5e00e0458:T=1620798814:S=ALNI_Mb_a5hzrGlOxrg-1mZ4q0r0SCtDTw; _gid=GA1.2.293144568.1621059907; gig_canary=false; gig_canary_ver=12081-3-27017640; gig_bootstrap_3_9roj6PMdw9D2zh_3-ZOrjINFiMqNep4jhiXtwP0NP2GvcHNWaixfsDVetR9VWW7Y=idp_ver4; gh_prod_token_anonymous={"token_type":"Bearer","access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjlkZWRiMjViYTkyNjg4OGI1ZTlmZGRkNzkxYWM4OTA3NDhiZWExMzk1MjdjNWJkZjY2MzI5YTNlN2UxNDc2MWJlOTg4NDljN2ZhMTliZTAxIn0.eyJhdWQiOiIxIiwianRpIjoiOWRlZGIyNWJhOTI2ODg4YjVlOWZkZGQ3OTFhYzg5MDc0OGJlYTEzOTUyN2M1YmRmNjYzMjlhM2U3ZTE0NzYxYmU5ODg0OWM3ZmExOWJlMDEiLCJpYXQiOjE1OTk1NjM1MzIsIm5iZiI6MTU5OTU2MzUzMiwiZXhwIjo0NzU1MjM3MTMyLCJzdWIiOiIxNSIsInNjb3BlcyI6W119.Udycov3V2URlf82xzcolr1L3BFVIZzncYnuN_z0Tc-fe36gXXMSYIYI_Jt6OZQsicJy7aTrW7NiqFu3LJeSSDTj8t-yInCoe3rYtLgBuc69OLA6e5tHoN7J2FFzlnEx03JbuFOnFUdISysnTn8iShcrr7E3mczS2Spk4AKKBLsOx2_KcdfjXfmOyna6adtPmC48bt6ChXY27DT2BRfGMngo93HG2uyz3Yryt3zDJEb4K5M05OHfVxkZ-_vo_BI_pMnzFaakvyi5mUnwbW2ysQei-Db2t05WaxrPclKgweG0v2tBDPSsOzNhtz51Ggm1xzEkU3lPUZ1bVr6N7wc0b2eHegOplhBz_BbPexEoQ81myyvdtCCllPMsXSTgXdHhqau5l2fPSJTqEHXt8I0YGhyZGZGoSh8J9HwcHwXCV4feOiEp28vvxdfZchtAg7tAKtU5ugBgpNPu6f6ufH9enbdbelJVN0PBRQsPkowSQ8limS3n5ASwg76yNX6TzYkw_rhcbEoN91HFjCQwh2TxiN5n3Tn-djNSBbrXO87FjFte_QCCgYRISnX0dVyvds6vUq-a7BjDUd_awXD3THY2EHvQ4NTPXN6AFNosaWFaprFiCyOkmhKKs7Jzimo_1w0qEG3IvzEmTxcOaPzW9yYfncmUsJvUeqsuHU2NQCY0qTh4","user_id":"15","favourites":null}; _ga=GA1.2.1053582277.1620798481; _gat_UA-99223133-1=1; _ga_X6QJTK7ZQG=GS1.1.1621064249.5.1.1621066909.48; RT="z=1&dm=gaming.uefa.com&si=9e2137f2-687d-4c0e-a830-cc2c7b70b826&ss=kophds5q&sl=0&tt=0"; OptanonConsent=isIABGlobal=false&datestamp=Sat+May+15+2021+13:51:50+GMT+0530+(India+Standard+Time)&version=6.6.0&hosts=&consentId=cd2657d4-9127-4c9b-871f-bf99abc58531&interactionCount=1&landingPath=NotLandingPage&groups=1:1,4:1,2:1&geolocation=IN;KA&AwaitingReconsent=false';

class FplService {

  async init() {
    this.playersPage = await this.downloadPage('https://gaming.uefa.com/en/uefaeuro2020fantasyfootball/services/api/Feed/players?matchdayId=1&lang=en&tour_id=1');
    this.preparePlayerData();
  }

  downloadPage(url) {
    return new Promise((resolve, reject) => {
      request({url: url, headers: {Cookie: COOKIE}}, (error, response, body) => {
        if (error) {
          reject(error);
        }
        try {
          if (response.statusCode != 200) {
            reject('Invalid status code <' + response.statusCode + '>' + '\turl: ' + url);
            return;
          }
          resolve(JSON.parse(body));
        } catch (err) {
          console.error(err);
          console.dir(err.stack);
          reject('Something went wrong. Response: ' + response + ' while accessing: ' + url);
        }
      });
    });
  }

  preparePlayerData() {
    this.playerData = [];
    var playerList = playersPage.data.value.playerList;
    for (var i in playerList) {
      var pData = {name: playerList[i].pDName};
      this.playerData.push(pData);
    }
  }

  getPlayerData() {
    return this.playerData;
  }

}

module.exports = FplService;