
const AuthChallenger = users => {
  return (username, password) => {
    return (
      typeof users[username] !== "undefined" && users[username] === password
    ); 
  };
};
//here we set a function to invoke users to check if input username/pw matches the data we have in our json
//it can not be undefined
module.exports = AuthChallenger;
