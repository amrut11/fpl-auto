const Arsenal = { 'Hashwanth': 496, 'Arun': 50167, 'Abinav': 25516, 'Venkatesh': 10840, 'Naveen': 7398, 'Prasannaa': 40997, 'Rajan': 1940010, 'Vijay': 35411 };

const Villa = { 'Kunal': 1912641, 'Anupam': 10785, 'Mihir': 3317436, 'Adi AVL': 88467, 'Suhas': 925882, 'Himanshu AVL': 378795, 'Tushar': 300709, 'Rishabh': 20770 };

const Brentford = { 'Jyotirmoy': 313589, 'Utsav': 951363, 'Soumik': 67084, 'Vishnu': 167307, 'Saurabh BRE': 984338, 'Torkel': 6922, 'Eirik': 2170302, 'Christian': 115952 };

const Brighton = { 'Saksham': 7306, 'Uday': 7723, 'Samarth': 57783, 'Manan BRI': 17061, 'Anson': 880321, 'Tanmay': 6295, 'Giridhar': 904631, 'Aakash': 6609 };

const Burnley = { 'Meghan': 15012, 'Siddharth': 156809, 'Sagar M': 28110, 'Sagar S': 21598, 'Eshaan': 3228078, 'Dhruv BUR': 2489, 'Devansh': 2166500, 'Maitreya': 825079 };

const Chelsea = { 'Fawaz': 3296, 'Anurag': 2606, 'Kunwar': 2270611, 'Shahid': 2191417, 'Ali': 20648, 'Stefan': 4816468, 'Usama': 602219, 'Prachi': 5702329 };

const Palace = { 'Raj': 702257, 'Akshay CRY': 955977, 'Aritra': 16462, 'Arnit': 6741, 'Chandrakant': 938, 'Daksh': 198782, 'Nishant': 6241, 'Shanan': 3840463 };

const Everton = { 'Saleem': 590444, 'Tanveer': 1518, 'Amrut': 4807, 'Sushant': 1485012, 'Shashank': 878138, 'Srijan': 928594, 'Avi Tarun': 8705, 'Hitesh': 3306805 };

const Leeds = { 'Brynal': 5221, 'Rebant': 11749, 'Siva': 1266698, 'Nadar': 1763863, 'Ashwin': 1769866, 'Taha': 1775247, 'Akshay LEE': 3445750, 'Aamod': 3679976 };

const Leicester = { 'Ritayan': 24861, 'Mrinmoy': 185581, 'Dishant': 12093, 'Adi LEI': 32265, 'Kamal': 4286, 'Harshit LEI': 10756, 'Manan LEI': 19630, 'Paresh': 9082 };

const Liverpool = { 'Amandeep': 23078, 'Akilesh': 45511, 'Ninad': 1740654, 'Hisham': 911, 'Rohit': 9012, 'Malhar': 3642210, 'Keshav': 22400 };

const ManCity = { 'Dhruv MCI': 579572, 'Rishi': 92249, 'Rohan MCI': 47007, 'Sathish': 78620, 'Gaurang': 67150, 'Sahil': 3380, 'Samson': 3894, 'Nidhin': 163818 };

const ManUtd = { 'Vasu': 18088, 'Sudhanshu': 5130039, 'Abheek': 3463818, 'Dev': 2612352, 'Debarshee': 1399252, 'Gautam': 44421, 'Vikram': 16174, 'Raunak': 1281274 };

const Newcastle = { 'Mohit': 9178, 'Abdul': 190836, 'Milan': 10193, 'Prateek NEW': 75910, 'John': 2784, 'Dan': 225238, 'Saunak': 17663, 'AbuBakar': 31 };

const Norwich = { 'Diganta': 98887, 'Subhajit': 1476665, 'Subhagata': 85387, 'Faheem': 4289156, 'Prateek NOR': 276854, 'Souvick': 3350911, 'Sayantan': 2757, 'Abdur': 2586048 };

const Southampton = { 'Roman': 8776, 'Suvankar': 48908, 'Sunil': 66397, 'Rohan SOU': 1075246, 'Shamoon': 852237, 'Soumyadut': 6341, 'Melvin': 18446, 'Geordie': 8361 };

const Spurs = { 'Jasjeev': 3805159, 'Suraj': 3302453, 'Ranjeev': 2469966, 'Sathyanarayanan': 1637844, 'Prasanth': 1288568, 'Harshit TOT': 263239, 'Ronit': 8420, 'Saurabh TOT': 1028655 };

const Watford = { 'Furqan': 149964, 'Ishan': 509837, 'Puspak': 1805468, 'Viraj': 3026380, 'Khisal': 79307, 'Preet': 26186, 'Rajaram': 460, 'Zain': 1165 };

const WestHam = { 'Himanshu WHU': 17034, 'Rohan WHU': 11786, 'Yash': 2228007, 'Rupana': 37940, 'Karan G': 2317991, 'Karan K': 3092254, 'Manmeek': 1244299, 'Pavneet': 3374190 };

const Wolves = { 'Piyush': 1021345, 'Sounak': 878756, 'Adwait': 1312701, 'Malay': 6390, 'Dhaval': 11096, 'Avi Das': 21983, 'Debarun': 24788, 'Jaskaran': 11023 };

const allPlayers = Object.assign({}, Arsenal, Villa, Brentford, Brighton, Burnley, Chelsea, Palace, Everton, Leeds, Leicester, Liverpool, ManCity, ManUtd, Newcastle, Norwich, Southampton, Spurs, Watford, WestHam, Wolves);

module.exports = {
  arsenalPlayers: Arsenal,
  villaPlayers: Villa,
  brentfordPlayers: Brentford,
  brightonPlayers: Brighton,
  burnleyPlayers: Burnley,
  chelseaPlayers: Chelsea,
  palacePlayers: Palace,
  evertonPlayers: Everton,
  leedsPlayers: Leeds,
  leicesterPlayers: Leicester,
  liverpoolPlayers: Liverpool,
  mancityPlayers: ManCity,
  manutdPlayers: ManUtd,
  newcastlePlayers: Newcastle,
  norwichPlayers: Norwich,
  southamptonPlayers: Southampton,
  spursPlayers: Spurs,
  watfordPlayers: Watford,
  westhamPlayers: WestHam,
  wolvesPlayers: Wolves,
  allPlayers
}