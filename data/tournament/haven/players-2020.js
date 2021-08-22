const arsenal = {
  'Tanbirul': 773604, 'M Syd': 2723, 'Vicky': 112018, 'Karan': 8617, 'Mohit': 29261, 'Melvin': 590, 'Lawrence': 8594, 'Vishal': 17362, 'Ashish': 827614, 'Aman': 1182
}
// 'Arshad': 111829

const chelsea = {
  'Sarbik': 3943, 'Abhi Belsare': 758648, 'Varun': 524903, 'Rithvik': 205654, 'Dhruv C': 674547, 'Antarik': 44136, 'Soumajyoti': 85442, 'Harshal': 535226, 'UD Saha': 4533, 'Sai Samarth': 551379
}

const everton = {
  'James': 138009, 'Rohan P': 1555, 'Adi Naik': 140819, 'Rishi': 8550, 'Lovesh': 32739, 'Aniruddh': 5492, 'Giridhar': 411859, 'Dhruv M': 221828, 'Harshit': 536581, 'Nikhil D': 464052
}

const leeds = {
  'Nilay': 629432, 'Rushabh': 726993, 'Debarun': 191717, 'Yash': 17302, 'Subhankar': 8072, 'Aalok': 712174, 'Ronit': 1091, 'Kedar': 34876, 'Nikhil S': 3491683, 'Rohan M': 94476
}
//'Abhay': 695901

const leicester = {
  'Richard': 616393, 'George': 1910, 'Matt': 2489, 'Hisham': 1770, 'Roman': 16790, 'Karthik': 535825, 'Saunak': 6862, 'Samson': 2066, 'Sayantan': 7420, 'Abhi Behera': 1451346
}

const liverpool = {
  'Saksham A': 2576, 'Malay': 95429, 'Gaurang': 228178, 'Piyush': 767877, 'Aakash': 544794, 'Samarth': 10118, 'Rishabh K': 10405, 'Adi Nayak': 121939, 'Vaibhav': 13613, 'Manan': 3314
}

const manCity = {
  'Tanveer': 218, 'Sahil': 30134, 'Saleem': 270861, 'Dhaval': 5530, 'Sushant': 821, 'Avi Das': 19941, 'Avi Tarun': 713, 'Amrut': 6955, 'Shashank': 50857, 'Srijan': 611100
}

const manUnited = {
  'Keshav': 2387, 'Akshat': 154767, 'Yugam': 2305, 'Sudarshan': 24091, 'Saksham S': 942048, 'Tanish': 837621, 'Udhav': 144526, 'Sarthak': 39468, 'Abir': 57134, 'Nischay': 779416
}

const tottenham = {
  'Bilalullah': 482674, 'Parth': 537288, 'Utkarsh': 628617, 'Sid Shenoy': 604406, 'Mihir': 535373, 'Rahul': 612795, 'Vineet': 537838, 'Sid Trehan': 1952, 'Jaskaran': 621061, 'Ameen': 17992
}

const wolves = {
  'Rishabh A': 640835, 'Sid Jain': 645765, 'Param': 680351, 'Daksh': 670678, 'Biswojit': 128742, 'Tanmay': 47715, 'Falak': 2895438, 'Darshil': 667663, 'Saswat': 567923, 'Anson': 666545
}

const freeAgents = {'Brynal': 363320, 'Tarun': 481921, 'Sagar': 1010826, 'Pranav': 5457663, 'Manish': 5168596, 'Karan': 8617, 'Spandan': 2082820, 'Gagan': 4973185, 'Ayan': 2251, 'Abhay': 695901, 'Aman S': 1339847, 'Ninad': 3085054, 'Dhiren': 1306038, 'Uday': 50344, 'Ankit': 8243, 'Anish': 3984515, 'Arjun': 1772274, 'Darren': 4100350, 'Bhaibhav': 284087, 'Dwij': 2242856, 'Vivek': 1283794, 'Prem': 535529, 'Brij': 467910, 'Huzaifa': 2911841, 'Sunny': 2627};

const allPlayers = Object.assign({}, arsenal, chelsea, everton, leeds, leicester, liverpool, manCity, manUnited, tottenham, wolves, freeAgents);

module.exports = {
  arsenalPlayers: arsenal,
  chelseaPlayers: chelsea,
  evertonPlayers: everton,
  leedsPlayers: leeds,
  leicesterPlayers: leicester,
  liverpoolPlayers: liverpool,
  mancityPlayers: manCity,
  manunitedPlayers: manUnited,
  tottenhamPlayers: tottenham,
  wolvesPlayers: wolves,
  freeAgents: freeAgents,
  allPlayers
}