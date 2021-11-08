exports.run = (client, message, args) => {

var userid = message.guild.id.concat(message.author.id);
var charid = client.userMap.get(userid,"possess");

let local = client.charcall.charData(client,charid,"local");

let sec = client.landMap.get(local[4],local[0]);
let occList = sec[local[1]][local[2]][2][local[3]][4];
let speeddial = client.userMap.get(userid,"speeddial");

if(!client.funcall.dmcheck(client,message)){
  message.channel.send("Only a DM can use this command! Make sure to give yourself a role named \"DM\" if you're in charge!");
  return;
}

if(!args[0]){
  let msg = ``;
  let msg2 = ``;
  let i;

  for(i=0;i<occList.length;i++){
      msg += `**[${i+1}]** **${client.charcall.charData(client,occList[i][1],"name").toUpperCase()}**\n\n`;
  }
  for(let j=0;j<speeddial.length;j++){
    msg2 += `**[${i+1}] ${speeddial[j][1].toUpperCase()}**\n\n`;
    i++;
  }
  possessList = new client.Discord.MessageEmbed()
  .setTitle("**POSSESS LIST**")
  .addField(`**CURRENT OCCUPANTS:**`,msg)
  .addField(`**SPEED DIAL:**`,msg2)
  .addField(`**CURRENTLY POSSESSING:**`,`**${client.charcall.charData(client,client.userMap.get(userid,"possess"),"name")}**\nTo stop possessing, do ${client.auth.prefix}possess cancel`)

  message.channel.send(possessList);

  return;
}

if(args[0]=="cancel"){

let target = client.userMap.get(userid,"possess");

  if(target==speeddial[0][0]){
    message.channel.send("You're already controlling your default character!");
    return;
  }
  //first, removes you from the control list of the target.
  let control = client.charcall.charData(client,target,"control");
  control.splice(control.indexOf(userid),1);
  client.charcall.setAnyData(client,userid,target,control,"control");

  //second, sets your default body to your current possess value.
  client.userMap.set(userid,speeddial[0][0],"possess");

  //last, adds you to the body's control list.
  charid = client.userMap.get(userid,"possess");
  let destination = client.charcall.charData(client,charid,"control");
  destination.push(userid);
  client.charcall.setAnyData(client,userid,charid,destination,"control");

  message.channel.send(`Stopped possessing ${client.charcall.charData(client,target,"name").toUpperCase()}!\n
  You have been shifted to your first Speed Dial option, ${speeddial[0][1].toUpperCase()}.`);
  return;
}
let isSpeed = false;
let target;
  value = parseInt(args[0], 10) - 1;
  if(isNaN(value)){
    message.channel.send("That is not a valid number!");
    return;
  }

  if(value >= occList.length+speeddial.length || value < 0) {
    message.channel.send("That target doesn't exist!")
    return;
  };
  if(value > occList.length){
    value = value-occList.length;
    isSpeed = true;
  }
  if(isSpeed){
    target = speeddial[value][0];
  } else {
    target = occList[value][1];
  }
  if(target==charid){
    message.channel.send("You're alredy possessing that character!");
    return;
  }
  //first,removes you from your currently possessed character.
  let control = client.charcall.charData(client,charid,"control");
  control.splice(control.indexOf(userid),1);
  client.charcall.setAnyData(client,userid,charid,control,"control");
  message.channel.send(`Stopped possessing ${client.charcall.charData(client,charid,"name").toUpperCase()}!`);
  //second, sets your current possession as your choice.
  client.userMap.set(userid,target,"possess");

  //last, adds you to the body's control list.
  charid = client.userMap.get(userid,"possess");
  let destination = client.charcall.charData(client,charid,"control");
  destination.push(userid);
  client.charcall.setAnyData(client,userid,charid,destination,"control");
  message.channel.send(`Now possessing ${client.charcall.charData(client,target,"name").toUpperCase()}!`);
}
