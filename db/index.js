var mysql = require('mysql');

var connection = mysql.createPool({
  connectionLimit: 20,
  host     : process.env.DB_HOST || 'localhost',
  user     : process.env.DB_USERNAME || 'root',
  password : process.env.DB_PASSWORD || '',
  database : process.env.DB_DATABASE || 'stock_tracker'
});

var getPurchases = function(userId, callback) {
  const query = 'SELECT * FROM purchases WHERE user_id = (SELECT id FROM users WHERE goog_id = ' + connection.escape(userId) + ')';
  connection.query(query, function(err, results) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

var getHistoricalData = function(ticker, date, callback) {
  let table = '';
  switch (ticker) {
    case 'VOO':
      table = 'sp_historical';
      break;
    case 'QQQ':
      table = 'nasdaq_historical';
      break;
    case 'DIA':
      table = 'dow_historical';
      break;
    default: 
      table = '';
  }
  const query = `SELECT * FROM ${table} WHERE date = "${date}"`;
  connection.query(query, function(err, results) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}

const createPurchase = function(user_id, submittedPurchase, callback) {
  const queryUserId = 'SELECT id from users WHERE goog_id = ' + connection.escape(user_id);

  connection.query(queryUserId, function(err, results) {
    if (err) {
      callback(err);
    } else {
      let queriedId = results[0].id;

      const query = `INSERT INTO purchases 
      (user_id, stock_ticker, num_of_shares, share_price, date_purchased, sp500_price, nasdaq_price, dow_price)
      VALUES (${queriedId}, "${submittedPurchase.stock_ticker}", ${submittedPurchase.num_of_shares}, ${submittedPurchase.share_price}, "${submittedPurchase.date_purchased}", ${submittedPurchase.sp500_price}, ${submittedPurchase.nasdaq_price}, ${submittedPurchase.dow_price})`;
  
      connection.query(query, function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }
  })
};

const createNewUser = (profile, callback) => {
  const query = `SELECT * FROM users where goog_id = '${profile.userId}'`;

  connection.query(query, function(err, results) {
    if (err) {
      callback(err);
    } else if (results.length === 0) {
      const secondQuery = `INSERT INTO users (goog_id, full_name, first_name, last_name, email, img_url)
        VALUES ("${profile.userId}", "${profile.fullName}", "${profile.firstName}", "${profile.lastName}", 
        "${profile.email}", "${profile.profileImg}")`;
      
      connection.query(secondQuery, function(err, results) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      })
    }
  })
}

module.exports = { getPurchases, getHistoricalData, createPurchase, createNewUser };
