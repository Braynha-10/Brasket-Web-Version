// Base de dados oficial do Brassket: 10 Franquias por ERA + Classes Históricas do NBA Draft
const BRASSKET_ERAS = {
  // ==========================================
  // ERA ATUAL (2024-2025)
  // ==========================================
  modern: {
    id: "modern",
    name: "Era Atual (2024-2025)",
    tagline: "A era do arremesso de três pontos, ritmo alucinante e astros globais.",
    badge: "MODERNA",
    icon: "⚡",
    draftClass: [
      { name: "Victor Wembanyama", pos: "C", college: "Metropolitans 92 (França)", ovr: 88, truePot: 99, scoutedPot: 98, o3pt: 82, ins: 92, def: 98, ply: 80, isGem: true, isBust: false },
      { name: "Brandon Miller", pos: "SF", college: "Alabama", ovr: 80, truePot: 91, scoutedPot: 90, o3pt: 86, ins: 82, def: 81, ply: 76, isGem: false, isBust: false },
      { name: "Scoot Henderson", pos: "PG", college: "G League Ignite", ovr: 77, truePot: 86, scoutedPot: 92, o3pt: 72, ins: 86, def: 75, ply: 85, isGem: false, isBust: true },
      { name: "Chet Holmgren", pos: "C", college: "Gonzaga", ovr: 83, truePot: 95, scoutedPot: 92, o3pt: 84, ins: 85, def: 94, ply: 78, isGem: true, isBust: false },
      { name: "Amen Thompson", pos: "SG", college: "Overtime Elite", ovr: 79, truePot: 90, scoutedPot: 89, o3pt: 68, ins: 90, def: 88, ply: 82, isGem: false, isBust: false },
      { name: "Stephon Castle", pos: "PG", college: "UConn", ovr: 78, truePot: 90, scoutedPot: 88, o3pt: 74, ins: 80, def: 88, ply: 82, isGem: false, isBust: false },
      { name: "Reed Sheppard", pos: "SG", college: "Kentucky", ovr: 78, truePot: 89, scoutedPot: 87, o3pt: 92, ins: 74, def: 78, ply: 82, isGem: false, isBust: false },
      { name: "Alex Sarr", pos: "C", college: "Perth Wildcats (Austrália)", ovr: 77, truePot: 88, scoutedPot: 89, o3pt: 70, ins: 80, def: 90, ply: 68, isGem: false, isBust: false }
    ],
    teams: [
      {
        id: "LAL",
        name: "Los Angeles Lakers",
        city: "Los Angeles",
        conference: "West",
        color: "#552583",
        secondaryColor: "#FDB927",
        arena: "Crypto.com Arena",
        arenaCapacity: 19000,
        arenaLevel: 3,
        ticketPrice: 65,
        budget: 45000000,
        fanLoyalty: 94,
        roster: [
          { id: 101, name: "LeBron James", pos: "SF", ovr: 96, o3pt: 84, ins: 97, def: 84, ply: 96, sta: 82, clutch: 98, age: 39, salary: 48, morale: 95, injured: 0 },
          { id: 102, name: "Anthony Davis", pos: "C", ovr: 94, o3pt: 68, ins: 95, def: 98, ply: 75, sta: 85, clutch: 90, age: 31, salary: 43, morale: 92, injured: 0 },
          { id: 103, name: "Austin Reaves", pos: "SG", ovr: 83, o3pt: 85, ins: 82, def: 74, ply: 84, sta: 88, clutch: 85, age: 26, salary: 13, morale: 90, injured: 0 },
          { id: 104, name: "D'Angelo Russell", pos: "PG", ovr: 82, o3pt: 87, ins: 78, def: 70, ply: 86, sta: 84, clutch: 82, age: 28, salary: 18, morale: 85, injured: 0 },
          { id: 105, name: "Rui Hachimura", pos: "PF", ovr: 80, o3pt: 81, ins: 82, def: 75, ply: 68, sta: 85, clutch: 78, age: 26, salary: 17, morale: 86, injured: 0 },
          { id: 106, name: "Dalton Knecht", pos: "SG", ovr: 77, o3pt: 88, ins: 75, def: 68, ply: 70, sta: 88, clutch: 80, age: 23, salary: 4, morale: 90, injured: 0 },
          { id: 107, name: "Jarred Vanderbilt", pos: "PF", ovr: 78, o3pt: 60, ins: 72, def: 90, ply: 68, sta: 86, clutch: 72, age: 25, salary: 11, morale: 84, injured: 0 }
        ]
      },
      {
        id: "GSW",
        name: "Golden State Warriors",
        city: "San Francisco",
        conference: "West",
        color: "#1D428A",
        secondaryColor: "#FFC72C",
        arena: "Chase Center",
        arenaCapacity: 18064,
        arenaLevel: 3,
        ticketPrice: 70,
        budget: 42000000,
        fanLoyalty: 96,
        roster: [
          { id: 111, name: "Stephen Curry", pos: "PG", ovr: 96, o3pt: 99, ins: 90, def: 74, ply: 92, sta: 88, clutch: 99, age: 36, salary: 51, morale: 98, injured: 0 },
          { id: 112, name: "Draymond Green", pos: "PF", ovr: 84, o3pt: 70, ins: 74, def: 96, ply: 91, sta: 82, clutch: 88, age: 34, salary: 24, morale: 88, injured: 0 },
          { id: 113, name: "Jonathan Kuminga", pos: "SF", ovr: 83, o3pt: 74, ins: 89, def: 80, ply: 72, sta: 92, clutch: 80, age: 22, salary: 8, morale: 89, injured: 0 },
          { id: 114, name: "Andrew Wiggins", pos: "SF", ovr: 81, o3pt: 81, ins: 82, def: 83, ply: 70, sta: 84, clutch: 77, age: 29, salary: 26, morale: 82, injured: 0 },
          { id: 115, name: "Trayce Jackson-Davis", pos: "C", ovr: 79, o3pt: 50, ins: 85, def: 83, ply: 70, sta: 88, clutch: 74, age: 24, salary: 2, morale: 86, injured: 0 },
          { id: 116, name: "Buddy Hield", pos: "SG", ovr: 80, o3pt: 91, ins: 70, def: 68, ply: 70, sta: 84, clutch: 82, age: 31, salary: 9, morale: 87, injured: 0 }
        ]
      },
      {
        id: "BOS",
        name: "Boston Celtics",
        city: "Boston",
        conference: "East",
        color: "#007A33",
        secondaryColor: "#BA9653",
        arena: "TD Garden",
        arenaCapacity: 19156,
        arenaLevel: 3,
        ticketPrice: 72,
        budget: 44000000,
        fanLoyalty: 98,
        roster: [
          { id: 121, name: "Jayson Tatum", pos: "SF", ovr: 96, o3pt: 88, ins: 95, def: 89, ply: 86, sta: 93, clutch: 94, age: 26, salary: 35, morale: 98, injured: 0 },
          { id: 122, name: "Jaylen Brown", pos: "SG", ovr: 92, o3pt: 83, ins: 94, def: 88, ply: 78, sta: 91, clutch: 93, age: 27, salary: 49, morale: 97, injured: 0 },
          { id: 123, name: "Derrick White", pos: "PG", ovr: 87, o3pt: 88, ins: 82, def: 92, ply: 86, sta: 90, clutch: 89, age: 30, salary: 20, morale: 95, injured: 0 },
          { id: 124, name: "Jrue Holiday", pos: "PG", ovr: 86, o3pt: 85, ins: 82, def: 95, ply: 84, sta: 86, clutch: 91, age: 34, salary: 30, morale: 94, injured: 0 },
          { id: 125, name: "Kristaps Porzingis", pos: "C", ovr: 88, o3pt: 88, ins: 89, def: 90, ply: 70, sta: 80, clutch: 85, age: 29, salary: 29, morale: 91, injured: 0 },
          { id: 126, name: "Al Horford", pos: "C", ovr: 80, o3pt: 82, ins: 76, def: 84, ply: 78, sta: 76, clutch: 86, age: 38, salary: 10, morale: 92, injured: 0 }
        ]
      },
      {
        id: "DEN",
        name: "Denver Nuggets",
        city: "Denver",
        conference: "West",
        color: "#0E2240",
        secondaryColor: "#FEC524",
        arena: "Ball Arena",
        arenaCapacity: 19520,
        arenaLevel: 3,
        ticketPrice: 62,
        budget: 40000000,
        fanLoyalty: 94,
        roster: [
          { id: 131, name: "Nikola Jokic", pos: "C", ovr: 98, o3pt: 84, ins: 98, def: 82, ply: 99, sta: 92, clutch: 97, age: 29, salary: 51, morale: 97, injured: 0 },
          { id: 132, name: "Jamal Murray", pos: "PG", ovr: 88, o3pt: 88, ins: 88, def: 76, ply: 87, sta: 85, clutch: 96, age: 27, salary: 36, morale: 91, injured: 0 },
          { id: 133, name: "Michael Porter Jr.", pos: "SF", ovr: 85, o3pt: 92, ins: 84, def: 75, ply: 66, sta: 86, clutch: 84, age: 26, salary: 35, morale: 88, injured: 0 },
          { id: 134, name: "Aaron Gordon", pos: "PF", ovr: 84, o3pt: 72, ins: 91, def: 90, ply: 78, sta: 90, clutch: 86, age: 29, salary: 23, morale: 92, injured: 0 },
          { id: 135, name: "Christian Braun", pos: "SG", ovr: 79, o3pt: 79, ins: 81, def: 82, ply: 72, sta: 91, clutch: 78, age: 23, salary: 3, morale: 89, injured: 0 },
          { id: 136, name: "Russell Westbrook", pos: "PG", ovr: 80, o3pt: 68, ins: 86, def: 78, ply: 84, sta: 86, clutch: 82, age: 35, salary: 3, morale: 87, injured: 0 }
        ]
      },
      {
        id: "OKC",
        name: "Oklahoma City Thunder",
        city: "Oklahoma City",
        conference: "West",
        color: "#007AC1",
        secondaryColor: "#EF3B24",
        arena: "Paycom Center",
        arenaCapacity: 18203,
        arenaLevel: 2,
        ticketPrice: 56,
        budget: 52000000,
        fanLoyalty: 95,
        roster: [
          { id: 141, name: "Shai Gilgeous-Alexander", pos: "PG", ovr: 96, o3pt: 84, ins: 98, def: 88, ply: 92, sta: 92, clutch: 96, age: 26, salary: 36, morale: 98, injured: 0 },
          { id: 142, name: "Chet Holmgren", pos: "C", ovr: 88, o3pt: 85, ins: 87, def: 95, ply: 78, sta: 85, clutch: 86, age: 22, salary: 11, morale: 94, injured: 0 },
          { id: 143, name: "Jalen Williams", pos: "SF", ovr: 87, o3pt: 84, ins: 90, def: 86, ply: 84, sta: 90, clutch: 88, age: 23, salary: 5, morale: 95, injured: 0 },
          { id: 144, name: "Alex Caruso", pos: "SG", ovr: 82, o3pt: 80, ins: 75, def: 95, ply: 80, sta: 86, clutch: 86, age: 30, salary: 10, morale: 90, injured: 0 },
          { id: 145, name: "Isaiah Hartenstein", pos: "C", ovr: 82, o3pt: 50, ins: 82, def: 89, ply: 78, sta: 86, clutch: 78, age: 26, salary: 30, morale: 88, injured: 0 },
          { id: 146, name: "Luguentz Dort", pos: "SG", ovr: 81, o3pt: 82, ins: 76, def: 93, ply: 70, sta: 89, clutch: 82, age: 25, salary: 16, morale: 89, injured: 0 }
        ]
      },
      {
        id: "NYK",
        name: "New York Knicks",
        city: "New York",
        conference: "East",
        color: "#006BB6",
        secondaryColor: "#F58426",
        arena: "Madison Square Garden",
        arenaCapacity: 19812,
        arenaLevel: 3,
        ticketPrice: 76,
        budget: 48000000,
        fanLoyalty: 97,
        roster: [
          { id: 151, name: "Jalen Brunson", pos: "PG", ovr: 94, o3pt: 88, ins: 96, def: 76, ply: 91, sta: 92, clutch: 98, age: 28, salary: 35, morale: 97, injured: 0 },
          { id: 152, name: "Karl-Anthony Towns", pos: "C", ovr: 90, o3pt: 92, ins: 92, def: 81, ply: 78, sta: 86, clutch: 85, age: 28, salary: 49, morale: 91, injured: 0 },
          { id: 153, name: "Mikal Bridges", pos: "SG", ovr: 86, o3pt: 85, ins: 84, def: 90, ply: 78, sta: 95, clutch: 84, age: 28, salary: 23, morale: 92, injured: 0 },
          { id: 154, name: "OG Anunoby", pos: "SF", ovr: 86, o3pt: 84, ins: 82, def: 95, ply: 72, sta: 88, clutch: 86, age: 27, salary: 36, morale: 93, injured: 0 },
          { id: 155, name: "Josh Hart", pos: "SG", ovr: 82, o3pt: 78, ins: 82, def: 86, ply: 82, sta: 98, clutch: 88, age: 29, salary: 18, morale: 96, injured: 0 },
          { id: 156, name: "Miles McBride", pos: "PG", ovr: 78, o3pt: 85, ins: 74, def: 84, ply: 74, sta: 88, clutch: 81, age: 24, salary: 5, morale: 89, injured: 0 }
        ]
      },
      {
        id: "DAL",
        name: "Dallas Mavericks",
        city: "Dallas",
        conference: "West",
        color: "#00538C",
        secondaryColor: "#002B5E",
        arena: "American Airlines Center",
        arenaCapacity: 19200,
        arenaLevel: 3,
        ticketPrice: 62,
        budget: 42000000,
        fanLoyalty: 95,
        roster: [
          { id: 161, name: "Luka Doncic", pos: "PG", ovr: 97, o3pt: 89, ins: 96, def: 74, ply: 98, sta: 86, clutch: 98, age: 25, salary: 43, morale: 96, injured: 0 },
          { id: 162, name: "Kyrie Irving", pos: "SG", ovr: 92, o3pt: 91, ins: 95, def: 75, ply: 89, sta: 84, clutch: 97, age: 32, salary: 40, morale: 94, injured: 0 },
          { id: 163, name: "Klay Thompson", pos: "SG", ovr: 83, o3pt: 92, ins: 74, def: 73, ply: 70, sta: 80, clutch: 89, age: 34, salary: 16, morale: 88, injured: 0 },
          { id: 164, name: "PJ Washington", pos: "PF", ovr: 81, o3pt: 79, ins: 80, def: 84, ply: 71, sta: 88, clutch: 81, age: 26, salary: 15, morale: 87, injured: 0 },
          { id: 165, name: "Dereck Lively II", pos: "C", ovr: 82, o3pt: 50, ins: 88, def: 88, ply: 69, sta: 88, clutch: 78, age: 20, salary: 5, morale: 93, injured: 0 },
          { id: 166, name: "Daniel Gafford", pos: "C", ovr: 80, o3pt: 50, ins: 88, def: 84, ply: 64, sta: 85, clutch: 75, age: 26, salary: 13, morale: 88, injured: 0 }
        ]
      },
      {
        id: "MIL",
        name: "Milwaukee Bucks",
        city: "Milwaukee",
        conference: "East",
        color: "#00471B",
        secondaryColor: "#EEE1C6",
        arena: "Fiserv Forum",
        arenaCapacity: 17341,
        arenaLevel: 3,
        ticketPrice: 60,
        budget: 38000000,
        fanLoyalty: 92,
        roster: [
          { id: 171, name: "Giannis Antetokounmpo", pos: "PF", ovr: 97, o3pt: 68, ins: 99, def: 96, ply: 88, sta: 94, clutch: 95, age: 29, salary: 48, morale: 96, injured: 0 },
          { id: 172, name: "Damian Lillard", pos: "PG", ovr: 91, o3pt: 93, ins: 90, def: 72, ply: 89, sta: 86, clutch: 98, age: 34, salary: 48, morale: 92, injured: 0 },
          { id: 173, name: "Khris Middleton", pos: "SF", ovr: 83, o3pt: 86, ins: 82, def: 77, ply: 83, sta: 78, clutch: 90, age: 33, salary: 31, morale: 87, injured: 0 },
          { id: 174, name: "Brook Lopez", pos: "C", ovr: 82, o3pt: 83, ins: 78, def: 91, ply: 64, sta: 78, clutch: 82, age: 36, salary: 23, morale: 88, injured: 0 },
          { id: 175, name: "Bobby Portis", pos: "PF", ovr: 81, o3pt: 82, ins: 84, def: 75, ply: 68, sta: 86, clutch: 83, age: 29, salary: 13, morale: 90, injured: 0 }
        ]
      },
      {
        id: "MIN",
        name: "Minnesota Timberwolves",
        city: "Minneapolis",
        conference: "West",
        color: "#0C2340",
        secondaryColor: "#78BE20",
        arena: "Target Center",
        arenaCapacity: 18024,
        arenaLevel: 2,
        ticketPrice: 55,
        budget: 36000000,
        fanLoyalty: 91,
        roster: [
          { id: 181, name: "Anthony Edwards", pos: "SG", ovr: 94, o3pt: 86, ins: 96, def: 86, ply: 84, sta: 93, clutch: 95, age: 23, salary: 42, morale: 97, injured: 0 },
          { id: 182, name: "Rudy Gobert", pos: "C", ovr: 87, o3pt: 50, ins: 84, def: 97, ply: 62, sta: 88, clutch: 77, age: 32, salary: 44, morale: 89, injured: 0 },
          { id: 183, name: "Julius Randle", pos: "PF", ovr: 86, o3pt: 78, ins: 90, def: 77, ply: 82, sta: 86, clutch: 83, age: 29, salary: 29, morale: 86, injured: 0 },
          { id: 184, name: "Jaden McDaniels", pos: "SF", ovr: 82, o3pt: 79, ins: 78, def: 92, ply: 70, sta: 90, clutch: 79, age: 24, salary: 23, morale: 88, injured: 0 },
          { id: 185, name: "Mike Conley", pos: "PG", ovr: 81, o3pt: 84, ins: 72, def: 76, ply: 89, sta: 78, clutch: 86, age: 36, salary: 10, morale: 92, injured: 0 },
          { id: 186, name: "Naz Reid", pos: "C", ovr: 83, o3pt: 85, ins: 86, def: 78, ply: 74, sta: 85, clutch: 86, age: 25, salary: 14, morale: 93, injured: 0 }
        ]
      },
      {
        id: "PHI",
        name: "Philadelphia 76ers",
        city: "Philadelphia",
        conference: "East",
        color: "#006BB6",
        secondaryColor: "#ED174C",
        arena: "Wells Fargo Center",
        arenaCapacity: 20478,
        arenaLevel: 3,
        ticketPrice: 64,
        budget: 40000000,
        fanLoyalty: 93,
        roster: [
          { id: 191, name: "Joel Embiid", pos: "C", ovr: 97, o3pt: 84, ins: 99, def: 95, ply: 82, sta: 82, clutch: 93, age: 30, salary: 51, morale: 94, injured: 0 },
          { id: 192, name: "Tyrese Maxey", pos: "PG", ovr: 90, o3pt: 88, ins: 94, def: 77, ply: 86, sta: 94, clutch: 92, age: 23, salary: 35, morale: 96, injured: 0 },
          { id: 193, name: "Paul George", pos: "SF", ovr: 89, o3pt: 89, ins: 88, def: 88, ply: 82, sta: 84, clutch: 88, age: 34, salary: 49, morale: 91, injured: 0 },
          { id: 194, name: "Kelly Oubre Jr.", pos: "SG", ovr: 80, o3pt: 78, ins: 84, def: 78, ply: 68, sta: 86, clutch: 80, age: 28, salary: 8, morale: 88, injured: 0 },
          { id: 195, name: "Caleb Martin", pos: "SF", ovr: 79, o3pt: 79, ins: 78, def: 83, ply: 73, sta: 87, clutch: 82, age: 29, salary: 8, morale: 87, injured: 0 }
        ]
      }
    ]
  },

  // ==========================================
  // ERA ANOS 2000 (2000-2009)
  // ==========================================
  "2000s": {
    id: "2000s",
    name: "Era Anos 2000 (2000-2009)",
    tagline: "O basquete físico de meia quadra, isolamento e hegemonia de lendas.",
    badge: "ANOS 2000",
    icon: "🔥",
    draftClass: [
      { name: "LeBron James (Rookie)", pos: "SF", college: "St. Vincent-St. Mary HS", ovr: 87, truePot: 99, scoutedPot: 98, o3pt: 75, ins: 96, def: 84, ply: 92, isGem: true, isBust: false },
      { name: "Dwyane Wade (Rookie)", pos: "SG", college: "Marquette", ovr: 83, truePot: 97, scoutedPot: 90, o3pt: 72, ins: 95, def: 86, ply: 86, isGem: true, isBust: false },
      { name: "Carmelo Anthony (Rookie)", pos: "SF", college: "Syracuse", ovr: 84, truePot: 94, scoutedPot: 95, o3pt: 82, ins: 94, def: 75, ply: 78, isGem: false, isBust: false },
      { name: "Chris Bosh (Rookie)", pos: "PF", college: "Georgia Tech", ovr: 80, truePot: 92, scoutedPot: 89, o3pt: 70, ins: 86, def: 85, ply: 74, isGem: false, isBust: false },
      { name: "Darko Milicic", pos: "C", college: "Hemofarm (Sérvia)", ovr: 72, truePot: 76, scoutedPot: 96, o3pt: 50, ins: 74, def: 75, ply: 60, isGem: false, isBust: true },
      { name: "Dwight Howard (Rookie)", pos: "C", college: "SW Atlanta Christian", ovr: 82, truePot: 96, scoutedPot: 94, o3pt: 50, ins: 95, def: 97, ply: 64, isGem: true, isBust: false },
      { name: "Chris Paul (Rookie)", pos: "PG", college: "Wake Forest", ovr: 84, truePot: 96, scoutedPot: 92, o3pt: 82, ins: 84, def: 88, ply: 98, isGem: true, isBust: false },
      { name: "Kevin Durant (Rookie)", pos: "SF", college: "Texas", ovr: 84, truePot: 98, scoutedPot: 96, o3pt: 90, ins: 92, def: 78, ply: 80, isGem: true, isBust: false }
    ],
    teams: [
      {
        id: "LAL_00",
        name: "Los Angeles Lakers (2001)",
        city: "Los Angeles",
        conference: "West",
        color: "#552583",
        secondaryColor: "#FDB927",
        arena: "Staples Center",
        arenaCapacity: 18997,
        arenaLevel: 3,
        ticketPrice: 65,
        budget: 45000000,
        fanLoyalty: 98,
        roster: [
          { id: 201, name: "Shaquille O'Neal", pos: "C", ovr: 98, o3pt: 50, ins: 99, def: 94, ply: 76, sta: 88, clutch: 96, age: 28, salary: 21, morale: 98, injured: 0 },
          { id: 202, name: "Kobe Bryant", pos: "SG", ovr: 97, o3pt: 85, ins: 98, def: 95, ply: 88, sta: 96, clutch: 99, age: 22, salary: 10, morale: 99, injured: 0 },
          { id: 203, name: "Derek Fisher", pos: "PG", ovr: 81, o3pt: 84, ins: 75, def: 80, ply: 82, sta: 88, clutch: 92, age: 26, salary: 5, morale: 90, injured: 0 },
          { id: 204, name: "Rick Fox", pos: "SF", ovr: 80, o3pt: 80, ins: 78, def: 82, ply: 78, sta: 85, clutch: 84, age: 31, salary: 4, morale: 88, injured: 0 },
          { id: 205, name: "Horace Grant", pos: "PF", ovr: 81, o3pt: 55, ins: 82, def: 88, ply: 72, sta: 82, clutch: 80, age: 35, salary: 6, morale: 89, injured: 0 },
          { id: 206, name: "Robert Horry", pos: "PF", ovr: 79, o3pt: 85, ins: 76, def: 83, ply: 74, sta: 82, clutch: 98, age: 30, salary: 5, morale: 95, injured: 0 }
        ]
      },
      {
        id: "SAS_00",
        name: "San Antonio Spurs (2003)",
        city: "San Antonio",
        conference: "West",
        color: "#000000",
        secondaryColor: "#C4CED4",
        arena: "SBC Center",
        arenaCapacity: 18500,
        arenaLevel: 3,
        ticketPrice: 58,
        budget: 42000000,
        fanLoyalty: 95,
        roster: [
          { id: 211, name: "Tim Duncan", pos: "PF", ovr: 98, o3pt: 55, ins: 98, def: 99, ply: 86, sta: 92, clutch: 97, age: 26, salary: 12, morale: 98, injured: 0 },
          { id: 212, name: "Tony Parker", pos: "PG", ovr: 86, o3pt: 72, ins: 94, def: 75, ply: 88, sta: 90, clutch: 88, age: 20, salary: 2, morale: 92, injured: 0 },
          { id: 213, name: "Manu Ginóbili", pos: "SG", ovr: 85, o3pt: 83, ins: 88, def: 84, ply: 86, sta: 88, clutch: 96, age: 25, salary: 3, morale: 94, injured: 0 },
          { id: 214, name: "David Robinson", pos: "C", ovr: 84, o3pt: 50, ins: 84, def: 95, ply: 70, sta: 76, clutch: 85, age: 37, salary: 10, morale: 95, injured: 0 },
          { id: 215, name: "Bruce Bowen", pos: "SF", ovr: 82, o3pt: 84, ins: 65, def: 98, ply: 66, sta: 94, clutch: 82, age: 31, salary: 4, morale: 90, injured: 0 },
          { id: 216, name: "Stephen Jackson", pos: "SF", ovr: 81, o3pt: 80, ins: 82, def: 81, ply: 75, sta: 88, clutch: 86, age: 24, salary: 1, morale: 89, injured: 0 }
        ]
      },
      {
        id: "PHI_00",
        name: "Philadelphia 76ers (2001)",
        city: "Philadelphia",
        conference: "East",
        color: "#006BB6",
        secondaryColor: "#ED174C",
        arena: "First Union Center",
        arenaCapacity: 20444,
        arenaLevel: 3,
        ticketPrice: 62,
        budget: 39000000,
        fanLoyalty: 96,
        roster: [
          { id: 221, name: "Allen Iverson", pos: "SG", ovr: 97, o3pt: 80, ins: 99, def: 86, ply: 89, sta: 99, clutch: 99, age: 25, salary: 10, morale: 99, injured: 0 },
          { id: 222, name: "Dikembe Mutombo", pos: "C", ovr: 88, o3pt: 50, ins: 78, def: 98, ply: 60, sta: 86, clutch: 82, age: 34, salary: 14, morale: 92, injured: 0 },
          { id: 223, name: "Eric Snow", pos: "PG", ovr: 80, o3pt: 65, ins: 76, def: 90, ply: 86, sta: 90, clutch: 80, age: 27, salary: 4, morale: 88, injured: 0 },
          { id: 224, name: "Aaron McKie", pos: "SG", ovr: 81, o3pt: 81, ins: 80, def: 86, ply: 82, sta: 88, clutch: 84, age: 28, salary: 5, morale: 90, injured: 0 },
          { id: 225, name: "Tyrone Hill", pos: "PF", ovr: 79, o3pt: 50, ins: 82, def: 88, ply: 62, sta: 86, clutch: 76, age: 32, salary: 6, morale: 86, injured: 0 }
        ]
      },
      {
        id: "DET_00",
        name: "Detroit Pistons (2004)",
        city: "Detroit",
        conference: "East",
        color: "#006BB6",
        secondaryColor: "#ED174C",
        arena: "The Palace of Auburn Hills",
        arenaCapacity: 22076,
        arenaLevel: 3,
        ticketPrice: 58,
        budget: 41000000,
        fanLoyalty: 97,
        roster: [
          { id: 231, name: "Ben Wallace", pos: "C", ovr: 92, o3pt: 50, ins: 75, def: 99, ply: 62, sta: 96, clutch: 88, age: 29, salary: 6, morale: 98, injured: 0 },
          { id: 232, name: "Chauncey Billups", pos: "PG", ovr: 90, o3pt: 88, ins: 86, def: 88, ply: 92, sta: 90, clutch: 99, age: 27, salary: 6, morale: 97, injured: 0 },
          { id: 233, name: "Richard Hamilton", pos: "SG", ovr: 88, o3pt: 83, ins: 92, def: 84, ply: 78, sta: 99, clutch: 92, age: 26, salary: 8, morale: 94, injured: 0 },
          { id: 234, name: "Rasheed Wallace", pos: "PF", ovr: 88, o3pt: 84, ins: 88, def: 93, ply: 76, sta: 88, clutch: 90, age: 29, salary: 17, morale: 93, injured: 0 },
          { id: 235, name: "Tayshaun Prince", pos: "SF", ovr: 84, o3pt: 79, ins: 80, def: 95, ply: 76, sta: 94, clutch: 86, age: 23, salary: 1, morale: 92, injured: 0 }
        ]
      },
      {
        id: "PHX_00",
        name: "Phoenix Suns (2005)",
        city: "Phoenix",
        conference: "West",
        color: "#1D1160",
        secondaryColor: "#E56020",
        arena: "America West Arena",
        arenaCapacity: 18422,
        arenaLevel: 3,
        ticketPrice: 60,
        budget: 40000000,
        fanLoyalty: 94,
        roster: [
          { id: 241, name: "Steve Nash", pos: "PG", ovr: 96, o3pt: 95, ins: 86, def: 68, ply: 99, sta: 90, clutch: 96, age: 30, salary: 9, morale: 98, injured: 0 },
          { id: 242, name: "Amar'e Stoudemire", pos: "C", ovr: 93, o3pt: 60, ins: 98, def: 80, ply: 72, sta: 92, clutch: 90, age: 22, salary: 2, morale: 95, injured: 0 },
          { id: 243, name: "Shawn Marion", pos: "SF", ovr: 90, o3pt: 81, ins: 90, def: 94, ply: 76, sta: 98, clutch: 85, age: 26, salary: 11, morale: 94, injured: 0 },
          { id: 244, name: "Joe Johnson", pos: "SG", ovr: 86, o3pt: 89, ins: 85, def: 78, ply: 84, sta: 92, clutch: 88, age: 23, salary: 2, morale: 90, injured: 0 },
          { id: 245, name: "Quentin Richardson", pos: "SF", ovr: 82, o3pt: 88, ins: 78, def: 76, ply: 72, sta: 88, clutch: 82, age: 24, salary: 4, morale: 89, injured: 0 }
        ]
      },
      {
        id: "MIA_00",
        name: "Miami Heat (2006)",
        city: "Miami",
        conference: "East",
        color: "#98002E",
        secondaryColor: "#F9A01B",
        arena: "American Airlines Arena",
        arenaCapacity: 19600,
        arenaLevel: 3,
        ticketPrice: 64,
        budget: 43000000,
        fanLoyalty: 96,
        roster: [
          { id: 251, name: "Dwyane Wade", pos: "SG", ovr: 97, o3pt: 75, ins: 99, def: 90, ply: 91, sta: 94, clutch: 99, age: 24, salary: 3, morale: 99, injured: 0 },
          { id: 252, name: "Shaquille O'Neal", pos: "C", ovr: 91, o3pt: 50, ins: 96, def: 88, ply: 74, sta: 80, clutch: 90, age: 33, salary: 20, morale: 93, injured: 0 },
          { id: 253, name: "Antoine Walker", pos: "PF", ovr: 81, o3pt: 82, ins: 80, def: 76, ply: 78, sta: 84, clutch: 84, age: 29, salary: 8, morale: 88, injured: 0 },
          { id: 254, name: "Jason Williams", pos: "PG", ovr: 82, o3pt: 84, ins: 76, def: 74, ply: 95, sta: 85, clutch: 85, age: 30, salary: 7, morale: 90, injured: 0 },
          { id: 255, name: "Udonis Haslem", pos: "PF", ovr: 81, o3pt: 50, ins: 82, def: 92, ply: 66, sta: 92, clutch: 86, age: 25, salary: 4, morale: 94, injured: 0 }
        ]
      },
      {
        id: "DAL_00",
        name: "Dallas Mavericks (2006)",
        city: "Dallas",
        conference: "West",
        color: "#00538C",
        secondaryColor: "#002B5E",
        arena: "American Airlines Center",
        arenaCapacity: 19200,
        arenaLevel: 3,
        ticketPrice: 60,
        budget: 41000000,
        fanLoyalty: 94,
        roster: [
          { id: 261, name: "Dirk Nowitzki", pos: "PF", ovr: 96, o3pt: 91, ins: 96, def: 82, ply: 80, sta: 92, clutch: 97, age: 27, salary: 13, morale: 97, injured: 0 },
          { id: 262, name: "Josh Howard", pos: "SF", ovr: 85, o3pt: 80, ins: 86, def: 86, ply: 76, sta: 90, clutch: 84, age: 25, salary: 2, morale: 91, injured: 0 },
          { id: 263, name: "Jason Terry", pos: "SG", ovr: 86, o3pt: 89, ins: 84, def: 74, ply: 84, sta: 90, clutch: 93, age: 28, salary: 8, morale: 93, injured: 0 },
          { id: 264, name: "Erick Dampier", pos: "C", ovr: 79, o3pt: 50, ins: 80, def: 86, ply: 58, sta: 80, clutch: 74, age: 30, salary: 8, morale: 86, injured: 0 },
          { id: 265, name: "Devin Harris", pos: "PG", ovr: 81, o3pt: 76, ins: 88, def: 80, ply: 84, sta: 91, clutch: 82, age: 22, salary: 2, morale: 90, injured: 0 }
        ]
      },
      {
        id: "MIN_00",
        name: "Minnesota Timberwolves (2004)",
        city: "Minneapolis",
        conference: "West",
        color: "#0C2340",
        secondaryColor: "#005083",
        arena: "Target Center",
        arenaCapacity: 18024,
        arenaLevel: 2,
        ticketPrice: 56,
        budget: 37000000,
        fanLoyalty: 93,
        roster: [
          { id: 271, name: "Kevin Garnett", pos: "PF", ovr: 98, o3pt: 68, ins: 98, def: 99, ply: 90, sta: 96, clutch: 96, age: 27, salary: 28, morale: 99, injured: 0 },
          { id: 272, name: "Sam Cassell", pos: "PG", ovr: 88, o3pt: 83, ins: 89, def: 80, ply: 92, sta: 88, clutch: 95, age: 34, salary: 5, morale: 94, injured: 0 },
          { id: 273, name: "Latrell Sprewell", pos: "SF", ovr: 86, o3pt: 80, ins: 89, def: 85, ply: 80, sta: 92, clutch: 88, age: 33, salary: 13, morale: 91, injured: 0 },
          { id: 274, name: "Ervin Johnson", pos: "C", ovr: 76, o3pt: 50, ins: 70, def: 85, ply: 58, sta: 78, clutch: 72, age: 36, salary: 4, morale: 85, injured: 0 },
          { id: 275, name: "Trenton Hassell", pos: "SG", ovr: 78, o3pt: 65, ins: 74, def: 90, ply: 70, sta: 88, clutch: 76, age: 24, salary: 1, morale: 87, injured: 0 }
        ]
      },
      {
        id: "SAC_00",
        name: "Sacramento Kings (2002)",
        city: "Sacramento",
        conference: "West",
        color: "#5A2D81",
        secondaryColor: "#63727A",
        arena: "ARCO Arena",
        arenaCapacity: 17317,
        arenaLevel: 3,
        ticketPrice: 62,
        budget: 39000000,
        fanLoyalty: 97,
        roster: [
          { id: 281, name: "Chris Webber", pos: "PF", ovr: 95, o3pt: 65, ins: 97, def: 90, ply: 91, sta: 90, clutch: 93, age: 28, salary: 12, morale: 97, injured: 0 },
          { id: 282, name: "Peja Stojakovic", pos: "SF", ovr: 89, o3pt: 96, ins: 82, def: 76, ply: 78, sta: 90, clutch: 92, age: 24, salary: 5, morale: 94, injured: 0 },
          { id: 283, name: "Mike Bibby", pos: "PG", ovr: 87, o3pt: 88, ins: 85, def: 78, ply: 88, sta: 90, clutch: 97, age: 23, salary: 4, morale: 95, injured: 0 },
          { id: 284, name: "Vlade Divac", pos: "C", ovr: 86, o3pt: 60, ins: 84, def: 85, ply: 92, sta: 82, clutch: 86, age: 33, salary: 11, morale: 92, injured: 0 },
          { id: 285, name: "Doug Christie", pos: "SG", ovr: 83, o3pt: 80, ins: 76, def: 96, ply: 82, sta: 92, clutch: 84, age: 31, salary: 5, morale: 91, injured: 0 }
        ]
      },
      {
        id: "CLE_00",
        name: "Cleveland Cavaliers (2007)",
        city: "Cleveland",
        conference: "East",
        color: "#6F263D",
        secondaryColor: "#FFB81C",
        arena: "Quicken Loans Arena",
        arenaCapacity: 20562,
        arenaLevel: 3,
        ticketPrice: 60,
        budget: 38000000,
        fanLoyalty: 95,
        roster: [
          { id: 291, name: "LeBron James", pos: "SF", ovr: 97, o3pt: 78, ins: 99, def: 88, ply: 95, sta: 98, clutch: 99, age: 22, salary: 6, morale: 99, injured: 0 },
          { id: 292, name: "Larry Hughes", pos: "SG", ovr: 82, o3pt: 72, ins: 85, def: 85, ply: 80, sta: 88, clutch: 80, age: 28, salary: 12, morale: 87, injured: 0 },
          { id: 293, name: "Zydrunas Ilgauskas", pos: "C", ovr: 83, o3pt: 50, ins: 88, def: 86, ply: 66, sta: 80, clutch: 82, age: 31, salary: 9, morale: 91, injured: 0 },
          { id: 294, name: "Drew Gooden", pos: "PF", ovr: 80, o3pt: 50, ins: 84, def: 80, ply: 65, sta: 86, clutch: 76, age: 25, salary: 6, morale: 88, injured: 0 },
          { id: 295, name: "Eric Snow", pos: "PG", ovr: 76, o3pt: 50, ins: 70, def: 86, ply: 82, sta: 82, clutch: 78, age: 33, salary: 6, morale: 86, injured: 0 }
        ]
      }
    ]
  },

  // ==========================================
  // ERA DE OURO (ANOS 90)
  // ==========================================
  "1990s": {
    id: "1990s",
    name: "Era de Ouro (1990-1999)",
    tagline: "A hegemonia de Michael Jordan, defesa física e o auge mundial da NBA.",
    badge: "ANOS 90",
    icon: "👑",
    draftClass: [
      { name: "Kobe Bryant (Rookie)", pos: "SG", college: "Lower Merion HS", ovr: 81, truePot: 99, scoutedPot: 93, o3pt: 80, ins: 92, def: 88, ply: 80, isGem: true, isBust: false },
      { name: "Allen Iverson (Rookie)", pos: "PG", college: "Georgetown", ovr: 85, truePot: 97, scoutedPot: 96, o3pt: 78, ins: 96, def: 84, ply: 88, isGem: true, isBust: false },
      { name: "Tim Duncan (Rookie)", pos: "PF", college: "Wake Forest", ovr: 87, truePot: 98, scoutedPot: 97, o3pt: 50, ins: 94, def: 96, ply: 80, isGem: true, isBust: false },
      { name: "Ray Allen (Rookie)", pos: "SG", college: "UConn", ovr: 81, truePot: 93, scoutedPot: 90, o3pt: 94, ins: 82, def: 76, ply: 78, isGem: false, isBust: false },
      { name: "Steve Nash (Rookie)", pos: "PG", college: "Santa Clara", ovr: 77, truePot: 95, scoutedPot: 84, o3pt: 90, ins: 76, def: 65, ply: 95, isGem: true, isBust: false },
      { name: "Kevin Garnett (Rookie)", pos: "PF", college: "Farragut Academy", ovr: 82, truePot: 98, scoutedPot: 91, o3pt: 65, ins: 88, def: 94, ply: 82, isGem: true, isBust: false },
      { name: "Dirk Nowitzki (Rookie)", pos: "PF", college: "DJK Würzburg (Alemanha)", ovr: 78, truePot: 96, scoutedPot: 82, o3pt: 88, ins: 84, def: 74, ply: 72, isGem: true, isBust: false },
      { name: "Vince Carter (Rookie)", pos: "SG", college: "North Carolina", ovr: 82, truePot: 94, scoutedPot: 93, o3pt: 82, ins: 98, def: 78, ply: 80, isGem: false, isBust: false }
    ],
    teams: [
      {
        id: "CHI_90",
        name: "Chicago Bulls (1996)",
        city: "Chicago",
        conference: "East",
        color: "#CE1141",
        secondaryColor: "#000000",
        arena: "United Center",
        arenaCapacity: 20917,
        arenaLevel: 3,
        ticketPrice: 68,
        budget: 50000000,
        fanLoyalty: 99,
        roster: [
          { id: 301, name: "Michael Jordan", pos: "SG", ovr: 99, o3pt: 86, ins: 99, def: 98, ply: 92, sta: 98, clutch: 99, age: 32, salary: 4, morale: 99, injured: 0 },
          { id: 302, name: "Scottie Pippen", pos: "SF", ovr: 95, o3pt: 80, ins: 93, def: 99, ply: 93, sta: 96, clutch: 92, age: 30, salary: 3, morale: 96, injured: 0 },
          { id: 303, name: "Dennis Rodman", pos: "PF", ovr: 90, o3pt: 50, ins: 68, def: 99, ply: 70, sta: 99, clutch: 90, age: 34, salary: 3, morale: 94, injured: 0 },
          { id: 304, name: "Ron Harper", pos: "PG", ovr: 82, o3pt: 75, ins: 82, def: 91, ply: 84, sta: 88, clutch: 82, age: 32, salary: 3, morale: 90, injured: 0 },
          { id: 305, name: "Luc Longley", pos: "C", ovr: 78, o3pt: 50, ins: 80, def: 84, ply: 66, sta: 80, clutch: 75, age: 27, salary: 2, morale: 88, injured: 0 },
          { id: 306, name: "Toni Kukoc", pos: "SF", ovr: 85, o3pt: 86, ins: 87, def: 74, ply: 88, sta: 86, clutch: 94, age: 27, salary: 3, morale: 93, injured: 0 }
        ]
      },
      {
        id: "HOU_90",
        name: "Houston Rockets (1994)",
        city: "Houston",
        conference: "West",
        color: "#CE1141",
        secondaryColor: "#FDB927",
        arena: "The Summit",
        arenaCapacity: 16611,
        arenaLevel: 3,
        ticketPrice: 58,
        budget: 42000000,
        fanLoyalty: 95,
        roster: [
          { id: 311, name: "Hakeem Olajuwon", pos: "C", ovr: 98, o3pt: 55, ins: 99, def: 99, ply: 84, sta: 95, clutch: 98, age: 31, salary: 3, morale: 99, injured: 0 },
          { id: 312, name: "Vernon Maxwell", pos: "SG", ovr: 83, o3pt: 84, ins: 82, def: 85, ply: 78, sta: 90, clutch: 89, age: 28, salary: 2, morale: 90, injured: 0 },
          { id: 313, name: "Otis Thorpe", pos: "PF", ovr: 84, o3pt: 50, ins: 89, def: 88, ply: 70, sta: 92, clutch: 82, age: 31, salary: 2, morale: 91, injured: 0 },
          { id: 314, name: "Kenny Smith", pos: "PG", ovr: 82, o3pt: 88, ins: 78, def: 75, ply: 86, sta: 88, clutch: 88, age: 28, salary: 2, morale: 90, injured: 0 },
          { id: 315, name: "Robert Horry", pos: "SF", ovr: 81, o3pt: 83, ins: 80, def: 86, ply: 75, sta: 89, clutch: 96, age: 23, salary: 1, morale: 92, injured: 0 }
        ]
      },
      {
        id: "UTA_90",
        name: "Utah Jazz (1997)",
        city: "Salt Lake City",
        conference: "West",
        color: "#002B5C",
        secondaryColor: "#00471B",
        arena: "Delta Center",
        arenaCapacity: 19911,
        arenaLevel: 3,
        ticketPrice: 56,
        budget: 40000000,
        fanLoyalty: 96,
        roster: [
          { id: 321, name: "Karl Malone", pos: "PF", ovr: 96, o3pt: 55, ins: 99, def: 92, ply: 84, sta: 98, clutch: 90, age: 33, salary: 4, morale: 97, injured: 0 },
          { id: 322, name: "John Stockton", pos: "PG", ovr: 95, o3pt: 85, ins: 88, def: 94, ply: 99, sta: 96, clutch: 97, age: 34, salary: 3, morale: 98, injured: 0 },
          { id: 323, name: "Jeff Hornacek", pos: "SG", ovr: 85, o3pt: 91, ins: 82, def: 78, ply: 84, sta: 88, clutch: 90, age: 33, salary: 3, morale: 92, injured: 0 },
          { id: 324, name: "Bryon Russell", pos: "SF", ovr: 80, o3pt: 84, ins: 78, def: 86, ply: 70, sta: 88, clutch: 78, age: 26, salary: 1, morale: 88, injured: 0 },
          { id: 325, name: "Greg Ostertag", pos: "C", ovr: 78, o3pt: 50, ins: 74, def: 88, ply: 58, sta: 78, clutch: 72, age: 24, salary: 1, morale: 86, injured: 0 }
        ]
      },
      {
        id: "NYK_90",
        name: "New York Knicks (1994)",
        city: "New York",
        conference: "East",
        color: "#006BB6",
        secondaryColor: "#F58426",
        arena: "Madison Square Garden",
        arenaCapacity: 19812,
        arenaLevel: 3,
        ticketPrice: 68,
        budget: 46000000,
        fanLoyalty: 98,
        roster: [
          { id: 331, name: "Patrick Ewing", pos: "C", ovr: 95, o3pt: 50, ins: 97, def: 98, ply: 72, sta: 92, clutch: 93, age: 31, salary: 4, morale: 97, injured: 0 },
          { id: 332, name: "John Starks", pos: "SG", ovr: 86, o3pt: 86, ins: 88, def: 88, ply: 82, sta: 94, clutch: 91, age: 28, salary: 2, morale: 94, injured: 0 },
          { id: 333, name: "Charles Oakley", pos: "PF", ovr: 85, o3pt: 50, ins: 82, def: 97, ply: 70, sta: 95, clutch: 86, age: 30, salary: 3, morale: 95, injured: 0 },
          { id: 334, name: "Derek Harper", pos: "PG", ovr: 83, o3pt: 82, ins: 80, def: 88, ply: 86, sta: 86, clutch: 85, age: 32, salary: 2, morale: 90, injured: 0 },
          { id: 335, name: "Anthony Mason", pos: "SF", ovr: 84, o3pt: 50, ins: 86, def: 92, ply: 80, sta: 94, clutch: 84, age: 27, salary: 2, morale: 92, injured: 0 }
        ]
      },
      {
        id: "ORL_90",
        name: "Orlando Magic (1995)",
        city: "Orlando",
        conference: "East",
        color: "#0077C0",
        secondaryColor: "#000000",
        arena: "Orlando Arena",
        arenaCapacity: 17283,
        arenaLevel: 3,
        ticketPrice: 58,
        budget: 41000000,
        fanLoyalty: 96,
        roster: [
          { id: 341, name: "Shaquille O'Neal", pos: "C", ovr: 97, o3pt: 50, ins: 99, def: 93, ply: 74, sta: 90, clutch: 93, age: 22, salary: 4, morale: 98, injured: 0 },
          { id: 342, name: "Penny Hardaway", pos: "PG", ovr: 94, o3pt: 83, ins: 96, def: 86, ply: 96, sta: 93, clutch: 95, age: 23, salary: 3, morale: 97, injured: 0 },
          { id: 343, name: "Nick Anderson", pos: "SG", ovr: 85, o3pt: 87, ins: 84, def: 81, ply: 79, sta: 90, clutch: 76, age: 27, salary: 2, morale: 89, injured: 0 },
          { id: 344, name: "Horace Grant", pos: "PF", ovr: 86, o3pt: 50, ins: 86, def: 94, ply: 75, sta: 92, clutch: 86, age: 29, salary: 3, morale: 94, injured: 0 },
          { id: 345, name: "Dennis Scott", pos: "SF", ovr: 82, o3pt: 93, ins: 74, def: 74, ply: 72, sta: 86, clutch: 85, age: 26, salary: 2, morale: 90, injured: 0 }
        ]
      },
      {
        id: "IND_90",
        name: "Indiana Pacers (1998)",
        city: "Indianapolis",
        conference: "East",
        color: "#002D62",
        secondaryColor: "#FDBB30",
        arena: "Market Square Arena",
        arenaCapacity: 16530,
        arenaLevel: 3,
        ticketPrice: 55,
        budget: 40000000,
        fanLoyalty: 94,
        roster: [
          { id: 351, name: "Reggie Miller", pos: "SG", ovr: 93, o3pt: 98, ins: 85, def: 82, ply: 80, sta: 95, clutch: 99, age: 32, salary: 3, morale: 98, injured: 0 },
          { id: 352, name: "Rik Smits", pos: "C", ovr: 86, o3pt: 50, ins: 92, def: 82, ply: 70, sta: 82, clutch: 88, age: 31, salary: 3, morale: 92, injured: 0 },
          { id: 353, name: "Mark Jackson", pos: "PG", ovr: 84, o3pt: 78, ins: 75, def: 82, ply: 95, sta: 88, clutch: 86, age: 32, salary: 2, morale: 91, injured: 0 },
          { id: 354, name: "Chris Mullin", pos: "SF", ovr: 83, o3pt: 93, ins: 78, def: 74, ply: 82, sta: 80, clutch: 90, age: 34, salary: 3, morale: 90, injured: 0 },
          { id: 355, name: "Dale Davis", pos: "PF", ovr: 82, o3pt: 50, ins: 80, def: 94, ply: 64, sta: 92, clutch: 82, age: 28, salary: 2, morale: 92, injured: 0 }
        ]
      },
      {
        id: "SEA_90",
        name: "Seattle SuperSonics (1996)",
        city: "Seattle",
        conference: "West",
        color: "#00653A",
        secondaryColor: "#FFC200",
        arena: "KeyArena",
        arenaCapacity: 17072,
        arenaLevel: 3,
        ticketPrice: 58,
        budget: 41000000,
        fanLoyalty: 98,
        roster: [
          { id: 361, name: "Gary Payton", pos: "PG", ovr: 95, o3pt: 79, ins: 92, def: 99, ply: 94, sta: 96, clutch: 96, age: 27, salary: 3, morale: 98, injured: 0 },
          { id: 362, name: "Shawn Kemp", pos: "PF", ovr: 93, o3pt: 50, ins: 99, def: 91, ply: 76, sta: 94, clutch: 92, age: 26, salary: 3, morale: 96, injured: 0 },
          { id: 363, name: "Detlef Schrempf", pos: "SF", ovr: 87, o3pt: 88, ins: 88, def: 80, ply: 84, sta: 90, clutch: 87, age: 33, salary: 3, morale: 92, injured: 0 },
          { id: 364, name: "Hersey Hawkins", pos: "SG", ovr: 84, o3pt: 88, ins: 82, def: 84, ply: 78, sta: 90, clutch: 84, age: 29, salary: 2, morale: 90, injured: 0 },
          { id: 365, name: "Sam Perkins", pos: "C", ovr: 82, o3pt: 85, ins: 80, def: 82, ply: 74, sta: 84, clutch: 86, age: 34, salary: 2, morale: 89, injured: 0 }
        ]
      },
      {
        id: "PHX_90",
        name: "Phoenix Suns (1993)",
        city: "Phoenix",
        conference: "West",
        color: "#1D1160",
        secondaryColor: "#E56020",
        arena: "America West Arena",
        arenaCapacity: 19023,
        arenaLevel: 3,
        ticketPrice: 60,
        budget: 42000000,
        fanLoyalty: 97,
        roster: [
          { id: 371, name: "Charles Barkley", pos: "PF", ovr: 97, o3pt: 72, ins: 99, def: 88, ply: 86, sta: 94, clutch: 98, age: 29, salary: 3, morale: 99, injured: 0 },
          { id: 372, name: "Kevin Johnson", pos: "PG", ovr: 90, o3pt: 70, ins: 95, def: 80, ply: 94, sta: 90, clutch: 91, age: 26, salary: 2, morale: 93, injured: 0 },
          { id: 373, name: "Dan Majerle", pos: "SG", ovr: 85, o3pt: 89, ins: 84, def: 88, ply: 78, sta: 93, clutch: 88, age: 27, salary: 2, morale: 92, injured: 0 },
          { id: 374, name: "Cedric Ceballos", pos: "SF", ovr: 82, o3pt: 65, ins: 89, def: 76, ply: 70, sta: 86, clutch: 80, age: 23, salary: 1, morale: 88, injured: 0 },
          { id: 375, name: "Mark West", pos: "C", ovr: 79, o3pt: 50, ins: 82, def: 85, ply: 58, sta: 82, clutch: 74, age: 32, salary: 1, morale: 86, injured: 0 }
        ]
      },
      {
        id: "POR_90",
        name: "Portland Trail Blazers (1992)",
        city: "Portland",
        conference: "West",
        color: "#E03A3E",
        secondaryColor: "#000000",
        arena: "Memorial Coliseum",
        arenaCapacity: 12888,
        arenaLevel: 2,
        ticketPrice: 54,
        budget: 38000000,
        fanLoyalty: 95,
        roster: [
          { id: 381, name: "Clyde Drexler", pos: "SG", ovr: 95, o3pt: 78, ins: 97, def: 88, ply: 89, sta: 96, clutch: 96, age: 29, salary: 2, morale: 97, injured: 0 },
          { id: 382, name: "Terry Porter", pos: "PG", ovr: 88, o3pt: 88, ins: 86, def: 84, ply: 90, sta: 92, clutch: 90, age: 28, salary: 2, morale: 93, injured: 0 },
          { id: 383, name: "Jerome Kersey", pos: "SF", ovr: 84, o3pt: 60, ins: 88, def: 88, ply: 76, sta: 94, clutch: 82, age: 29, salary: 1, morale: 90, injured: 0 },
          { id: 384, name: "Buck Williams", pos: "PF", ovr: 85, o3pt: 50, ins: 85, def: 95, ply: 66, sta: 94, clutch: 84, age: 31, salary: 2, morale: 92, injured: 0 },
          { id: 385, name: "Kevin Duckworth", pos: "C", ovr: 81, o3pt: 50, ins: 86, def: 80, ply: 62, sta: 80, clutch: 78, age: 27, salary: 2, morale: 88, injured: 0 }
        ]
      },
      {
        id: "SAS_90",
        name: "San Antonio Spurs (1999)",
        city: "San Antonio",
        conference: "West",
        color: "#000000",
        secondaryColor: "#C4CED4",
        arena: "Alamodome",
        arenaCapacity: 20600,
        arenaLevel: 3,
        ticketPrice: 58,
        budget: 42000000,
        fanLoyalty: 96,
        roster: [
          { id: 391, name: "Tim Duncan", pos: "PF", ovr: 96, o3pt: 50, ins: 97, def: 98, ply: 84, sta: 94, clutch: 96, age: 22, salary: 3, morale: 98, injured: 0 },
          { id: 392, name: "David Robinson", pos: "C", ovr: 93, o3pt: 50, ins: 92, def: 98, ply: 74, sta: 88, clutch: 92, age: 33, salary: 14, morale: 96, injured: 0 },
          { id: 393, name: "Sean Elliott", pos: "SF", ovr: 84, o3pt: 84, ins: 84, def: 82, ply: 78, sta: 88, clutch: 95, age: 30, salary: 5, morale: 92, injured: 0 },
          { id: 394, name: "Avery Johnson", pos: "PG", ovr: 82, o3pt: 50, ins: 82, def: 84, ply: 91, sta: 90, clutch: 88, age: 33, salary: 4, morale: 92, injured: 0 },
          { id: 395, name: "Mario Elie", pos: "SG", ovr: 81, o3pt: 83, ins: 80, def: 86, ply: 76, sta: 88, clutch: 92, age: 35, salary: 2, morale: 90, injured: 0 }
        ]
      }
    ]
  },

  // ==========================================
  // ERA SHOWTIME & RIVALIDADES (ANOS 80)
  // ==========================================
  "1980s": {
    id: "1980s",
    name: "Era Showtime & Rivalidades (1980-1989)",
    tagline: "O nascimento da NBA moderna: Magic vs Bird e a chegada dos Bad Boys.",
    badge: "ANOS 80",
    icon: "🌟",
    draftClass: [
      { name: "Michael Jordan (Rookie)", pos: "SG", college: "North Carolina", ovr: 86, truePot: 99, scoutedPot: 97, o3pt: 78, ins: 98, def: 92, ply: 86, isGem: true, isBust: false },
      { name: "Hakeem Olajuwon (Rookie)", pos: "C", college: "Houston", ovr: 86, truePot: 99, scoutedPot: 98, o3pt: 50, ins: 96, def: 98, ply: 76, isGem: true, isBust: false },
      { name: "Charles Barkley (Rookie)", pos: "PF", college: "Auburn", ovr: 84, truePot: 97, scoutedPot: 92, o3pt: 68, ins: 96, def: 84, ply: 80, isGem: true, isBust: false },
      { name: "John Stockton (Rookie)", pos: "PG", college: "Gonzaga", ovr: 78, truePot: 96, scoutedPot: 82, o3pt: 78, ins: 80, def: 88, ply: 98, isGem: true, isBust: false },
      { name: "Sam Bowie", pos: "C", college: "Kentucky", ovr: 76, truePot: 80, scoutedPot: 94, o3pt: 50, ins: 80, def: 82, ply: 64, isGem: false, isBust: true },
      { name: "Karl Malone (Rookie)", pos: "PF", college: "Louisiana Tech", ovr: 82, truePot: 97, scoutedPot: 88, o3pt: 50, ins: 96, def: 88, ply: 76, isGem: true, isBust: false },
      { name: "Scottie Pippen (Rookie)", pos: "SF", college: "Central Arkansas", ovr: 79, truePot: 96, scoutedPot: 86, o3pt: 70, ins: 84, def: 95, ply: 86, isGem: true, isBust: false },
      { name: "Reggie Miller (Rookie)", pos: "SG", college: "UCLA", ovr: 80, truePot: 94, scoutedPot: 88, o3pt: 95, ins: 76, def: 75, ply: 76, isGem: false, isBust: false }
    ],
    teams: [
      {
        id: "LAL_80",
        name: "Los Angeles Lakers (Showtime 1987)",
        city: "Los Angeles",
        conference: "West",
        color: "#552583",
        secondaryColor: "#FDB927",
        arena: "The Forum (Inglewood)",
        arenaCapacity: 17505,
        arenaLevel: 3,
        ticketPrice: 60,
        budget: 45000000,
        fanLoyalty: 99,
        roster: [
          { id: 401, name: "Magic Johnson", pos: "PG", ovr: 98, o3pt: 76, ins: 96, def: 85, ply: 99, sta: 96, clutch: 99, age: 27, salary: 3, morale: 99, injured: 0 },
          { id: 402, name: "Kareem Abdul-Jabbar", pos: "C", ovr: 94, o3pt: 50, ins: 99, def: 92, ply: 82, sta: 82, clutch: 96, age: 39, salary: 3, morale: 97, injured: 0 },
          { id: 403, name: "James Worthy", pos: "SF", ovr: 92, o3pt: 68, ins: 97, def: 85, ply: 78, sta: 94, clutch: 98, age: 25, salary: 2, morale: 96, injured: 0 },
          { id: 404, name: "Byron Scott", pos: "SG", ovr: 86, o3pt: 88, ins: 86, def: 82, ply: 76, sta: 90, clutch: 88, age: 25, salary: 1, morale: 92, injured: 0 },
          { id: 405, name: "A.C. Green", pos: "PF", ovr: 83, o3pt: 50, ins: 84, def: 90, ply: 68, sta: 99, clutch: 82, age: 23, salary: 1, morale: 93, injured: 0 },
          { id: 406, name: "Michael Cooper", pos: "SG", ovr: 85, o3pt: 82, ins: 76, def: 99, ply: 80, sta: 92, clutch: 90, age: 30, salary: 1, morale: 95, injured: 0 }
        ]
      },
      {
        id: "BOS_80",
        name: "Boston Celtics (1986)",
        city: "Boston",
        conference: "East",
        color: "#007A33",
        secondaryColor: "#BA9653",
        arena: "Boston Garden",
        arenaCapacity: 14890,
        arenaLevel: 3,
        ticketPrice: 62,
        budget: 45000000,
        fanLoyalty: 99,
        roster: [
          { id: 411, name: "Larry Bird", pos: "SF", ovr: 98, o3pt: 94, ins: 96, def: 88, ply: 97, sta: 96, clutch: 99, age: 29, salary: 3, morale: 99, injured: 0 },
          { id: 412, name: "Kevin McHale", pos: "PF", ovr: 94, o3pt: 50, ins: 99, def: 95, ply: 75, sta: 92, clutch: 94, age: 28, salary: 2, morale: 96, injured: 0 },
          { id: 413, name: "Robert Parish", pos: "C", ovr: 90, o3pt: 50, ins: 92, def: 93, ply: 72, sta: 90, clutch: 88, age: 32, salary: 2, morale: 94, injured: 0 },
          { id: 414, name: "Dennis Johnson", pos: "PG", ovr: 88, o3pt: 72, ins: 85, def: 96, ply: 88, sta: 92, clutch: 94, age: 31, salary: 1, morale: 95, injured: 0 },
          { id: 415, name: "Danny Ainge", pos: "SG", ovr: 84, o3pt: 86, ins: 82, def: 84, ply: 82, sta: 91, clutch: 87, age: 26, salary: 1, morale: 92, injured: 0 },
          { id: 416, name: "Bill Walton", pos: "C", ovr: 85, o3pt: 50, ins: 84, def: 92, ply: 88, sta: 74, clutch: 90, age: 33, salary: 1, morale: 96, injured: 0 }
        ]
      },
      {
        id: "DET_80",
        name: "Detroit Pistons (Bad Boys 1989)",
        city: "Detroit",
        conference: "East",
        color: "#006BB6",
        secondaryColor: "#ED174C",
        arena: "The Palace of Auburn Hills",
        arenaCapacity: 21454,
        arenaLevel: 3,
        ticketPrice: 58,
        budget: 42000000,
        fanLoyalty: 97,
        roster: [
          { id: 421, name: "Isiah Thomas", pos: "PG", ovr: 96, o3pt: 78, ins: 95, def: 88, ply: 98, sta: 94, clutch: 99, age: 27, salary: 2, morale: 99, injured: 0 },
          { id: 422, name: "Joe Dumars", pos: "SG", ovr: 91, o3pt: 85, ins: 88, def: 97, ply: 84, sta: 92, clutch: 94, age: 25, salary: 1, morale: 96, injured: 0 },
          { id: 423, name: "Bill Laimbeer", pos: "C", ovr: 87, o3pt: 78, ins: 84, def: 98, ply: 75, sta: 92, clutch: 88, age: 31, salary: 1, morale: 94, injured: 0 },
          { id: 424, name: "Mark Aguirre", pos: "SF", ovr: 86, o3pt: 75, ins: 92, def: 78, ply: 76, sta: 86, clutch: 86, age: 29, salary: 1, morale: 90, injured: 0 },
          { id: 425, name: "Rick Mahorn", pos: "PF", ovr: 83, o3pt: 50, ins: 80, def: 96, ply: 64, sta: 89, clutch: 82, age: 30, salary: 1, morale: 91, injured: 0 },
          { id: 426, name: "Dennis Rodman", pos: "PF", ovr: 87, o3pt: 50, ins: 70, def: 99, ply: 68, sta: 99, clutch: 89, age: 27, salary: 1, morale: 95, injured: 0 }
        ]
      },
      {
        id: "PHI_80",
        name: "Philadelphia 76ers (1983)",
        city: "Philadelphia",
        conference: "East",
        color: "#006BB6",
        secondaryColor: "#ED174C",
        arena: "The Spectrum",
        arenaCapacity: 18168,
        arenaLevel: 3,
        ticketPrice: 58,
        budget: 40000000,
        fanLoyalty: 96,
        roster: [
          { id: 431, name: "Moses Malone", pos: "C", ovr: 97, o3pt: 50, ins: 99, def: 96, ply: 72, sta: 96, clutch: 97, age: 27, salary: 2, morale: 98, injured: 0 },
          { id: 432, name: "Julius Erving (Dr. J)", pos: "SF", ovr: 96, o3pt: 68, ins: 99, def: 89, ply: 88, sta: 92, clutch: 98, age: 32, salary: 2, morale: 99, injured: 0 },
          { id: 433, name: "Maurice Cheeks", pos: "PG", ovr: 88, o3pt: 65, ins: 86, def: 96, ply: 92, sta: 92, clutch: 90, age: 26, salary: 1, morale: 94, injured: 0 },
          { id: 434, name: "Andrew Toney", pos: "SG", ovr: 88, o3pt: 78, ins: 94, def: 80, ply: 80, sta: 88, clutch: 97, age: 25, salary: 1, morale: 95, injured: 0 },
          { id: 435, name: "Bobby Jones", pos: "PF", ovr: 85, o3pt: 50, ins: 80, def: 98, ply: 76, sta: 88, clutch: 88, age: 31, salary: 1, morale: 94, injured: 0 }
        ]
      },
      {
        id: "ATL_80",
        name: "Atlanta Hawks (1988)",
        city: "Atlanta",
        conference: "East",
        color: "#C8102E",
        secondaryColor: "#FDB927",
        arena: "Omni Coliseum",
        arenaCapacity: 16378,
        arenaLevel: 2,
        ticketPrice: 52,
        budget: 37000000,
        fanLoyalty: 94,
        roster: [
          { id: 441, name: "Dominique Wilkins", pos: "SF", ovr: 96, o3pt: 74, ins: 99, def: 82, ply: 80, sta: 96, clutch: 96, age: 28, salary: 2, morale: 98, injured: 0 },
          { id: 442, name: "Doc Rivers", pos: "PG", ovr: 86, o3pt: 70, ins: 84, def: 88, ply: 94, sta: 90, clutch: 86, age: 26, salary: 1, morale: 92, injured: 0 },
          { id: 443, name: "Kevin Willis", pos: "PF", ovr: 84, o3pt: 50, ins: 88, def: 86, ply: 66, sta: 92, clutch: 80, age: 25, salary: 1, morale: 90, injured: 0 },
          { id: 444, name: "Tree Rollins", pos: "C", ovr: 81, o3pt: 50, ins: 76, def: 94, ply: 58, sta: 82, clutch: 76, age: 32, salary: 1, morale: 88, injured: 0 },
          { id: 445, name: "Spud Webb", pos: "PG", ovr: 80, o3pt: 72, ins: 89, def: 74, ply: 84, sta: 90, clutch: 84, age: 24, salary: 1, morale: 93, injured: 0 }
        ]
      },
      {
        id: "MIL_80",
        name: "Milwaukee Bucks (1986)",
        city: "Milwaukee",
        conference: "East",
        color: "#00471B",
        secondaryColor: "#EEE1C6",
        arena: "MECCA Arena",
        arenaCapacity: 11052,
        arenaLevel: 2,
        ticketPrice: 50,
        budget: 36000000,
        fanLoyalty: 92,
        roster: [
          { id: 451, name: "Sidney Moncrief", pos: "SG", ovr: 94, o3pt: 68, ins: 92, def: 99, ply: 88, sta: 94, clutch: 94, age: 28, salary: 1, morale: 96, injured: 0 },
          { id: 452, name: "Terry Cummings", pos: "PF", ovr: 89, o3pt: 50, ins: 94, def: 86, ply: 74, sta: 92, clutch: 88, age: 24, salary: 1, morale: 93, injured: 0 },
          { id: 453, name: "Paul Pressey", pos: "SF", ovr: 85, o3pt: 65, ins: 84, def: 92, ply: 92, sta: 90, clutch: 84, age: 27, salary: 1, morale: 91, injured: 0 },
          { id: 454, name: "Craig Hodges", pos: "PG", ovr: 81, o3pt: 94, ins: 72, def: 74, ply: 80, sta: 86, clutch: 86, age: 25, salary: 1, morale: 89, injured: 0 },
          { id: 455, name: "Jack Sikma", pos: "C", ovr: 86, o3pt: 75, ins: 88, def: 88, ply: 80, sta: 88, clutch: 88, age: 30, salary: 1, morale: 92, injured: 0 }
        ]
      },
      {
        id: "DEN_80",
        name: "Denver Nuggets (1985)",
        city: "Denver",
        conference: "West",
        color: "#0E2240",
        secondaryColor: "#FEC524",
        arena: "McNichols Sports Arena",
        arenaCapacity: 17022,
        arenaLevel: 2,
        ticketPrice: 52,
        budget: 37000000,
        fanLoyalty: 93,
        roster: [
          { id: 461, name: "Alex English", pos: "SF", ovr: 95, o3pt: 72, ins: 98, def: 80, ply: 84, sta: 94, clutch: 95, age: 31, salary: 1, morale: 97, injured: 0 },
          { id: 462, name: "Fat Lever", pos: "PG", ovr: 90, o3pt: 72, ins: 88, def: 94, ply: 94, sta: 96, clutch: 90, age: 24, salary: 1, morale: 94, injured: 0 },
          { id: 463, name: "Calvin Natt", pos: "PF", ovr: 86, o3pt: 50, ins: 91, def: 84, ply: 74, sta: 90, clutch: 86, age: 28, salary: 1, morale: 91, injured: 0 },
          { id: 464, name: "Wayne Cooper", pos: "C", ovr: 81, o3pt: 50, ins: 82, def: 88, ply: 64, sta: 84, clutch: 78, age: 28, salary: 1, morale: 88, injured: 0 },
          { id: 465, name: "T.R. Dunn", pos: "SG", ovr: 80, o3pt: 50, ins: 74, def: 96, ply: 72, sta: 90, clutch: 76, age: 29, salary: 1, morale: 88, injured: 0 }
        ]
      },
      {
        id: "HOU_80",
        name: "Houston Rockets (Twin Towers 1986)",
        city: "Houston",
        conference: "West",
        color: "#CE1141",
        secondaryColor: "#FDB927",
        arena: "The Summit",
        arenaCapacity: 16611,
        arenaLevel: 3,
        ticketPrice: 55,
        budget: 39000000,
        fanLoyalty: 95,
        roster: [
          { id: 471, name: "Hakeem Olajuwon", pos: "C", ovr: 96, o3pt: 50, ins: 98, def: 98, ply: 76, sta: 95, clutch: 96, age: 23, salary: 1, morale: 98, injured: 0 },
          { id: 472, name: "Ralph Sampson", pos: "PF", ovr: 92, o3pt: 50, ins: 94, def: 95, ply: 78, sta: 88, clutch: 94, age: 25, salary: 2, morale: 96, injured: 0 },
          { id: 473, name: "Rodney McCray", pos: "SF", ovr: 84, o3pt: 55, ins: 84, def: 90, ply: 82, sta: 90, clutch: 82, age: 24, salary: 1, morale: 90, injured: 0 },
          { id: 474, name: "Lewis Lloyd", pos: "SG", ovr: 83, o3pt: 65, ins: 89, def: 78, ply: 76, sta: 88, clutch: 84, age: 26, salary: 1, morale: 89, injured: 0 },
          { id: 475, name: "Robert Reid", pos: "PG", ovr: 82, o3pt: 75, ins: 82, def: 84, ply: 84, sta: 88, clutch: 86, age: 30, salary: 1, morale: 91, injured: 0 }
        ]
      },
      {
        id: "CHI_80",
        name: "Chicago Bulls (1988)",
        city: "Chicago",
        conference: "East",
        color: "#CE1141",
        secondaryColor: "#000000",
        arena: "Chicago Stadium",
        arenaCapacity: 17317,
        arenaLevel: 2,
        ticketPrice: 56,
        budget: 38000000,
        fanLoyalty: 97,
        roster: [
          { id: 481, name: "Michael Jordan", pos: "SG", ovr: 99, o3pt: 76, ins: 99, def: 98, ply: 88, sta: 99, clutch: 99, age: 24, salary: 2, morale: 99, injured: 0 },
          { id: 482, name: "Charles Oakley", pos: "PF", ovr: 86, o3pt: 50, ins: 85, def: 96, ply: 72, sta: 94, clutch: 85, age: 24, salary: 1, morale: 93, injured: 0 },
          { id: 483, name: "Scottie Pippen", pos: "SF", ovr: 82, o3pt: 65, ins: 84, def: 91, ply: 82, sta: 90, clutch: 82, age: 22, salary: 1, morale: 92, injured: 0 },
          { id: 484, name: "Sam Vincent", pos: "PG", ovr: 80, o3pt: 70, ins: 80, def: 78, ply: 84, sta: 86, clutch: 79, age: 24, salary: 1, morale: 88, injured: 0 },
          { id: 485, name: "Dave Corzine", pos: "C", ovr: 78, o3pt: 50, ins: 80, def: 82, ply: 65, sta: 80, clutch: 75, age: 31, salary: 1, morale: 87, injured: 0 }
        ]
      },
      {
        id: "DAL_80",
        name: "Dallas Mavericks (1988)",
        city: "Dallas",
        conference: "West",
        color: "#00538C",
        secondaryColor: "#002B5E",
        arena: "Reunion Arena",
        arenaCapacity: 17007,
        arenaLevel: 2,
        ticketPrice: 50,
        budget: 36000000,
        fanLoyalty: 92,
        roster: [
          { id: 491, name: "Mark Aguirre", pos: "SF", ovr: 90, o3pt: 76, ins: 95, def: 80, ply: 78, sta: 90, clutch: 90, age: 28, salary: 1, morale: 94, injured: 0 },
          { id: 492, name: "Rolando Blackman", pos: "SG", ovr: 89, o3pt: 82, ins: 92, def: 82, ply: 80, sta: 92, clutch: 92, age: 28, salary: 1, morale: 94, injured: 0 },
          { id: 493, name: "Derek Harper", pos: "PG", ovr: 87, o3pt: 83, ins: 84, def: 91, ply: 90, sta: 92, clutch: 88, age: 26, salary: 1, morale: 92, injured: 0 },
          { id: 494, name: "Sam Perkins", pos: "PF", ovr: 85, o3pt: 78, ins: 86, def: 86, ply: 74, sta: 88, clutch: 86, age: 26, salary: 1, morale: 91, injured: 0 },
          { id: 495, name: "James Donaldson", pos: "C", ovr: 81, o3pt: 50, ins: 80, def: 88, ply: 60, sta: 82, clutch: 76, age: 30, salary: 1, morale: 88, injured: 0 }
        ]
      }
    ]
  },

  // ==========================================
  // ERA CLÁSSICA (ANOS 70)
  // ==========================================
  "1970s": {
    id: "1970s",
    name: "Era Clássica (1970-1979)",
    tagline: "Basquete puro, pivôs lendários e a fusão histórica da NBA com a ABA.",
    badge: "ANOS 70",
    icon: "📻",
    draftClass: [
      { name: "Magic Johnson (Rookie)", pos: "PG", college: "Michigan State", ovr: 86, truePot: 99, scoutedPot: 98, o3pt: 70, ins: 94, def: 82, ply: 99, isGem: true, isBust: false },
      { name: "Larry Bird (Rookie)", pos: "SF", college: "Indiana State", ovr: 86, truePot: 99, scoutedPot: 97, o3pt: 90, ins: 92, def: 85, ply: 94, isGem: true, isBust: false },
      { name: "Bill Walton (Rookie)", pos: "C", college: "UCLA", ovr: 85, truePot: 98, scoutedPot: 98, o3pt: 50, ins: 94, def: 98, ply: 92, isGem: true, isBust: false },
      { name: "David Thompson (Rookie)", pos: "SG", college: "NC State", ovr: 84, truePot: 95, scoutedPot: 96, o3pt: 68, ins: 98, def: 82, ply: 80, isGem: false, isBust: false },
      { name: "Adrian Dantley (Rookie)", pos: "SF", college: "Notre Dame", ovr: 82, truePot: 94, scoutedPot: 89, o3pt: 65, ins: 96, def: 78, ply: 76, isGem: false, isBust: false },
      { name: "Bernard King (Rookie)", pos: "SF", college: "Tennessee", ovr: 82, truePot: 96, scoutedPot: 90, o3pt: 60, ins: 98, def: 78, ply: 75, isGem: true, isBust: false },
      { name: "Robert Parish (Rookie)", pos: "C", college: "Centenary", ovr: 80, truePot: 92, scoutedPot: 86, o3pt: 50, ins: 86, def: 90, ply: 68, isGem: false, isBust: false },
      { name: "Jack Sikma (Rookie)", pos: "C", college: "Illinois Wesleyan", ovr: 79, truePot: 90, scoutedPot: 81, o3pt: 70, ins: 84, def: 86, ply: 76, isGem: true, isBust: false }
    ],
    teams: [
      {
        id: "NYK_70",
        name: "New York Knicks (1970)",
        city: "New York",
        conference: "East",
        color: "#006BB6",
        secondaryColor: "#F58426",
        arena: "Madison Square Garden",
        arenaCapacity: 19500,
        arenaLevel: 3,
        ticketPrice: 50,
        budget: 35000000,
        fanLoyalty: 98,
        roster: [
          { id: 501, name: "Walt Frazier", pos: "PG", ovr: 96, o3pt: 60, ins: 95, def: 98, ply: 95, sta: 95, clutch: 98, age: 24, salary: 1, morale: 99, injured: 0 },
          { id: 502, name: "Willis Reed", pos: "C", ovr: 95, o3pt: 50, ins: 96, def: 97, ply: 75, sta: 88, clutch: 99, age: 27, salary: 1, morale: 99, injured: 0 },
          { id: 503, name: "Dave DeBusschere", pos: "PF", ovr: 89, o3pt: 50, ins: 86, def: 98, ply: 76, sta: 94, clutch: 90, age: 29, salary: 1, morale: 95, injured: 0 },
          { id: 504, name: "Bill Bradley", pos: "SF", ovr: 86, o3pt: 70, ins: 85, def: 82, ply: 86, sta: 92, clutch: 88, age: 26, salary: 1, morale: 94, injured: 0 },
          { id: 505, name: "Dick Barnett", pos: "SG", ovr: 85, o3pt: 65, ins: 89, def: 81, ply: 78, sta: 89, clutch: 86, age: 33, salary: 1, morale: 91, injured: 0 }
        ]
      },
      {
        id: "MIL_70",
        name: "Milwaukee Bucks (1971)",
        city: "Milwaukee",
        conference: "East",
        color: "#00471B",
        secondaryColor: "#EEE1C6",
        arena: "Milwaukee Arena",
        arenaCapacity: 10783,
        arenaLevel: 2,
        ticketPrice: 48,
        budget: 36000000,
        fanLoyalty: 97,
        roster: [
          { id: 511, name: "Kareem Abdul-Jabbar", pos: "C", ovr: 99, o3pt: 50, ins: 99, def: 99, ply: 84, sta: 97, clutch: 98, age: 23, salary: 1, morale: 99, injured: 0 },
          { id: 512, name: "Oscar Robertson", pos: "PG", ovr: 96, o3pt: 65, ins: 95, def: 88, ply: 99, sta: 92, clutch: 97, age: 32, salary: 1, morale: 98, injured: 0 },
          { id: 513, name: "Bob Dandridge", pos: "SF", ovr: 89, o3pt: 55, ins: 92, def: 89, ply: 78, sta: 93, clutch: 90, age: 23, salary: 1, morale: 94, injured: 0 },
          { id: 514, name: "Jon McGlocklin", pos: "SG", ovr: 83, o3pt: 75, ins: 84, def: 79, ply: 76, sta: 88, clutch: 85, age: 27, salary: 1, morale: 91, injured: 0 },
          { id: 515, name: "Greg Smith", pos: "PF", ovr: 81, o3pt: 50, ins: 82, def: 87, ply: 70, sta: 88, clutch: 80, age: 24, salary: 1, morale: 89, injured: 0 }
        ]
      },
      {
        id: "POR_70",
        name: "Portland Trail Blazers (1977)",
        city: "Portland",
        conference: "West",
        color: "#E03A3E",
        secondaryColor: "#000000",
        arena: "Memorial Coliseum",
        arenaCapacity: 12888,
        arenaLevel: 2,
        ticketPrice: 48,
        budget: 34000000,
        fanLoyalty: 96,
        roster: [
          { id: 521, name: "Bill Walton", pos: "C", ovr: 97, o3pt: 50, ins: 96, def: 99, ply: 94, sta: 90, clutch: 98, age: 24, salary: 1, morale: 99, injured: 0 },
          { id: 522, name: "Maurice Lucas", pos: "PF", ovr: 89, o3pt: 50, ins: 91, def: 95, ply: 76, sta: 94, clutch: 92, age: 24, salary: 1, morale: 96, injured: 0 },
          { id: 523, name: "Lionel Hollins", pos: "PG", ovr: 85, o3pt: 60, ins: 86, def: 90, ply: 88, sta: 92, clutch: 88, age: 23, salary: 1, morale: 93, injured: 0 },
          { id: 524, name: "Bob Gross", pos: "SF", ovr: 83, o3pt: 55, ins: 84, def: 86, ply: 80, sta: 89, clutch: 86, age: 23, salary: 1, morale: 91, injured: 0 },
          { id: 525, name: "Dave Twardzik", pos: "SG", ovr: 82, o3pt: 60, ins: 83, def: 82, ply: 82, sta: 88, clutch: 84, age: 26, salary: 1, morale: 90, injured: 0 }
        ]
      },
      {
        id: "WAS_70",
        name: "Washington Bullets (1978)",
        city: "Washington",
        conference: "East",
        color: "#002B5C",
        secondaryColor: "#E31837",
        arena: "Capital Centre",
        arenaCapacity: 19035,
        arenaLevel: 3,
        ticketPrice: 50,
        budget: 35000000,
        fanLoyalty: 95,
        roster: [
          { id: 531, name: "Elvin Hayes", pos: "PF", ovr: 95, o3pt: 50, ins: 97, def: 94, ply: 75, sta: 96, clutch: 94, age: 32, salary: 1, morale: 97, injured: 0 },
          { id: 532, name: "Wes Unseld", pos: "C", ovr: 93, o3pt: 50, ins: 88, def: 98, ply: 89, sta: 94, clutch: 96, age: 31, salary: 1, morale: 98, injured: 0 },
          { id: 533, name: "Bob Dandridge", pos: "SF", ovr: 89, o3pt: 55, ins: 92, def: 89, ply: 80, sta: 92, clutch: 92, age: 30, salary: 1, morale: 95, injured: 0 },
          { id: 534, name: "Tom Henderson", pos: "PG", ovr: 83, o3pt: 55, ins: 82, def: 85, ply: 88, sta: 90, clutch: 84, age: 25, salary: 1, morale: 91, injured: 0 },
          { id: 535, name: "Kevin Grevey", pos: "SG", ovr: 82, o3pt: 72, ins: 84, def: 78, ply: 76, sta: 88, clutch: 85, age: 24, salary: 1, morale: 90, injured: 0 }
        ]
      },
      {
        id: "LAL_70",
        name: "Los Angeles Lakers (1972)",
        city: "Los Angeles",
        conference: "West",
        color: "#552583",
        secondaryColor: "#FDB927",
        arena: "The Forum",
        arenaCapacity: 17505,
        arenaLevel: 3,
        ticketPrice: 52,
        budget: 37000000,
        fanLoyalty: 98,
        roster: [
          { id: 541, name: "Jerry West", pos: "PG", ovr: 97, o3pt: 75, ins: 97, def: 94, ply: 98, sta: 94, clutch: 99, age: 33, salary: 1, morale: 99, injured: 0 },
          { id: 542, name: "Wilt Chamberlain", pos: "C", ovr: 97, o3pt: 50, ins: 99, def: 99, ply: 86, sta: 98, clutch: 92, age: 35, salary: 1, morale: 97, injured: 0 },
          { id: 543, name: "Gail Goodrich", pos: "SG", ovr: 92, o3pt: 72, ins: 94, def: 82, ply: 86, sta: 94, clutch: 92, age: 28, salary: 1, morale: 95, injured: 0 },
          { id: 544, name: "Happy Hairston", pos: "PF", ovr: 85, o3pt: 50, ins: 88, def: 89, ply: 70, sta: 92, clutch: 82, age: 29, salary: 1, morale: 91, injured: 0 },
          { id: 545, name: "Jim McMillian", pos: "SF", ovr: 85, o3pt: 60, ins: 89, def: 84, ply: 78, sta: 92, clutch: 85, age: 23, salary: 1, morale: 92, injured: 0 }
        ]
      },
      {
        id: "BOS_70",
        name: "Boston Celtics (1974)",
        city: "Boston",
        conference: "East",
        color: "#007A33",
        secondaryColor: "#BA9653",
        arena: "Boston Garden",
        arenaCapacity: 14890,
        arenaLevel: 3,
        ticketPrice: 52,
        budget: 36000000,
        fanLoyalty: 98,
        roster: [
          { id: 551, name: "John Havlicek", pos: "SF", ovr: 96, o3pt: 68, ins: 96, def: 95, ply: 92, sta: 99, clutch: 99, age: 33, salary: 1, morale: 99, injured: 0 },
          { id: 552, name: "Dave Cowens", pos: "C", ovr: 95, o3pt: 50, ins: 95, def: 98, ply: 86, sta: 98, clutch: 95, age: 25, salary: 1, morale: 98, injured: 0 },
          { id: 553, name: "Jo Jo White", pos: "PG", ovr: 89, o3pt: 70, ins: 89, def: 86, ply: 90, sta: 94, clutch: 92, age: 27, salary: 1, morale: 94, injured: 0 },
          { id: 554, name: "Paul Silas", pos: "PF", ovr: 86, o3pt: 50, ins: 80, def: 98, ply: 70, sta: 95, clutch: 85, age: 30, salary: 1, morale: 93, injured: 0 },
          { id: 555, name: "Don Chaney", pos: "SG", ovr: 82, o3pt: 55, ins: 78, def: 95, ply: 76, sta: 90, clutch: 80, age: 27, salary: 1, morale: 90, injured: 0 }
        ]
      },
      {
        id: "GSW_70",
        name: "Golden State Warriors (1975)",
        city: "Oakland",
        conference: "West",
        color: "#1D428A",
        secondaryColor: "#FFC72C",
        arena: "Oakland Coliseum Arena",
        arenaCapacity: 15000,
        arenaLevel: 2,
        ticketPrice: 48,
        budget: 35000000,
        fanLoyalty: 95,
        roster: [
          { id: 561, name: "Rick Barry", pos: "SF", ovr: 96, o3pt: 78, ins: 97, def: 88, ply: 92, sta: 96, clutch: 99, age: 30, salary: 1, morale: 99, injured: 0 },
          { id: 562, name: "Jamaal Wilkes", pos: "SF", ovr: 87, o3pt: 65, ins: 89, def: 88, ply: 78, sta: 92, clutch: 88, age: 21, salary: 1, morale: 93, injured: 0 },
          { id: 563, name: "Clifford Ray", pos: "C", ovr: 83, o3pt: 50, ins: 80, def: 92, ply: 66, sta: 88, clutch: 80, age: 26, salary: 1, morale: 90, injured: 0 },
          { id: 564, name: "Charles Dudley", pos: "PG", ovr: 81, o3pt: 55, ins: 80, def: 82, ply: 86, sta: 88, clutch: 80, age: 24, salary: 1, morale: 89, injured: 0 },
          { id: 565, name: "Phil Smith", pos: "SG", ovr: 82, o3pt: 65, ins: 85, def: 80, ply: 78, sta: 89, clutch: 84, age: 22, salary: 1, morale: 90, injured: 0 }
        ]
      },
      {
        id: "SEA_70",
        name: "Seattle SuperSonics (1979)",
        city: "Seattle",
        conference: "West",
        color: "#00653A",
        secondaryColor: "#FFC200",
        arena: "Seattle Center Coliseum",
        arenaCapacity: 14098,
        arenaLevel: 2,
        ticketPrice: 48,
        budget: 35000000,
        fanLoyalty: 96,
        roster: [
          { id: 571, name: "Dennis Johnson", pos: "SG", ovr: 92, o3pt: 65, ins: 90, def: 99, ply: 88, sta: 95, clutch: 97, age: 24, salary: 1, morale: 98, injured: 0 },
          { id: 572, name: "Gus Williams", pos: "PG", ovr: 92, o3pt: 68, ins: 95, def: 85, ply: 92, sta: 94, clutch: 95, age: 25, salary: 1, morale: 97, injured: 0 },
          { id: 573, name: "Jack Sikma", pos: "C", ovr: 89, o3pt: 70, ins: 90, def: 92, ply: 80, sta: 92, clutch: 90, age: 23, salary: 1, morale: 95, injured: 0 },
          { id: 574, name: "John Johnson", pos: "SF", ovr: 83, o3pt: 55, ins: 84, def: 84, ply: 84, sta: 88, clutch: 82, age: 31, salary: 1, morale: 90, injured: 0 },
          { id: 575, name: "Lonnie Shelton", pos: "PF", ovr: 83, o3pt: 50, ins: 86, def: 88, ply: 68, sta: 89, clutch: 80, age: 23, salary: 1, morale: 90, injured: 0 }
        ]
      },
      {
        id: "NET_70",
        name: "New York Nets (ABA 1976)",
        city: "New York",
        conference: "East",
        color: "#002B5C",
        secondaryColor: "#D0103A",
        arena: "Nassau Veterans Memorial Coliseum",
        arenaCapacity: 15000,
        arenaLevel: 2,
        ticketPrice: 48,
        budget: 36000000,
        fanLoyalty: 95,
        roster: [
          { id: 581, name: "Julius Erving (Dr. J)", pos: "SF", ovr: 98, o3pt: 65, ins: 99, def: 90, ply: 90, sta: 96, clutch: 99, age: 25, salary: 1, morale: 99, injured: 0 },
          { id: 582, name: "John Williamson", pos: "SG", ovr: 87, o3pt: 70, ins: 90, def: 82, ply: 80, sta: 91, clutch: 94, age: 24, salary: 1, morale: 93, injured: 0 },
          { id: 583, name: "Rich Jones", pos: "PF", ovr: 84, o3pt: 55, ins: 86, def: 84, ply: 74, sta: 88, clutch: 80, age: 29, salary: 1, morale: 90, injured: 0 },
          { id: 584, name: "Brian Taylor", pos: "PG", ovr: 85, o3pt: 65, ins: 84, def: 94, ply: 86, sta: 92, clutch: 84, age: 24, salary: 1, morale: 91, injured: 0 },
          { id: 585, name: "Kim Hughes", pos: "C", ovr: 80, o3pt: 50, ins: 74, def: 92, ply: 60, sta: 84, clutch: 75, age: 23, salary: 1, morale: 88, injured: 0 }
        ]
      },
      {
        id: "PHI_70",
        name: "Philadelphia 76ers (1977)",
        city: "Philadelphia",
        conference: "East",
        color: "#006BB6",
        secondaryColor: "#ED174C",
        arena: "The Spectrum",
        arenaCapacity: 18168,
        arenaLevel: 3,
        ticketPrice: 50,
        budget: 36000000,
        fanLoyalty: 96,
        roster: [
          { id: 591, name: "Julius Erving (Dr. J)", pos: "SF", ovr: 97, o3pt: 66, ins: 99, def: 89, ply: 89, sta: 95, clutch: 98, age: 26, salary: 2, morale: 98, injured: 0 },
          { id: 592, name: "George McGinnis", pos: "PF", ovr: 93, o3pt: 55, ins: 95, def: 88, ply: 82, sta: 92, clutch: 92, age: 26, salary: 1, morale: 95, injured: 0 },
          { id: 593, name: "Doug Collins", pos: "SG", ovr: 88, o3pt: 68, ins: 90, def: 84, ply: 84, sta: 91, clutch: 88, age: 25, salary: 1, morale: 93, injured: 0 },
          { id: 594, name: "Caldwell Jones", pos: "C", ovr: 84, o3pt: 50, ins: 80, def: 95, ply: 66, sta: 88, clutch: 80, age: 26, salary: 1, morale: 90, injured: 0 },
          { id: 595, name: "Henry Bibby", pos: "PG", ovr: 81, o3pt: 68, ins: 78, def: 82, ply: 86, sta: 88, clutch: 82, age: 27, salary: 1, morale: 89, injured: 0 }
        ]
      }
    ]
  }
};

window.BRASSKET_ERAS = BRASSKET_ERAS;
window.getTeamsForEra = function(eraKey) {
    return BRASSKET_ERAS[eraKey]?.teams || BRASSKET_ERAS.modern.teams;
};
window.getDraftClassForEra = function(eraKey) {
    return BRASSKET_ERAS[eraKey]?.draftClass || BRASSKET_ERAS.modern.draftClass;
};
