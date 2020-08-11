function RespondEmail(e) {

  // set response mail
  var responsebody = "My Old Job email address will be deactivated soon. Please send your messages to my_mail@newjob.com in the future.";

  //var threads = GmailApp.search("to:(my_mail@oldjob.com) label:unread");
/*  for (var i = 0; i < threads.length; i++) {
    threads[i].reply("", {htmlBody: responsebody, from: "my_mail@newjob.com"});}

  // mark all as read
  //var threads = GmailApp.search("to:(my_mail@oldjob.com) label:unread");
  //GmailApp.markThreadsRead(threads);
}*/

 var url="http://dummy.restapiexample.com/api/v1/employees";
 var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();
  var data = JSON.parse(json);
  GenerateDigest();
  //Logger.log(data);
   //MailApp.sendEmail("marito_honorato@hotmail.com", "TEST_001", json);
  
  function GenerateDigest() {
  //Function that goes through a search query based on time and optional label in gmail, strips html, collates into a single email, sends it to a desired address and then labels the emails as processed.
  
  
  // Where the digest email is going
  var to_emailAddress = "marito_honorato@hotmail.com"; 
  
  
  //We calculate the 24 hour range, I plan to run this every day at 9:00 to get last 24 hours of emails
  /*var month = new Date().getMonth();
  var date = new Date().getDate();
  var year = new Date().getFullYear();
  var time1 = new Date(year, month, date, 0, 0, 0).getTime();
  //24 hours in miliseconds
  var time2 = time1 - 86400000;
  
  // Query to select the messages to digest, tweak to select labels or origins e.g. From:
  var query = "newer:" + time2/1000 + " older:"  + time1/1000 + " in:inbox" + " -label:Digested from:newsfeed@anotherdomain.com"; 
  
  */
  var query = "from:marito_honorato@hotmail.com"; 
  var threads = GmailApp.search(query);
  
  
  var messages;
  var message;
  var date;
  var date_formatted;
  var subject;
  var body_html;
  var body_plain;
  var body_plain_excerpt;
  var digest_body;
  
    try {
    digest_body="";
    messages="Empty";
    
    for(var t in threads) {
    
      // Get ALL the messages to each thread
      messages = threads[t].getMessages();
      startseparator = "----Start------";
      endseparator =   "------End------";
      crlf = "\n";
    
      
      for(var m in messages) {        
        message = messages[m].getBody();
        date  = messages[m].getDate();
        subject = messages[m].getSubject();
        body_html = messages[m].getBody();
        
        //Google returns the body content in html, so we remove the html formatting
     //   body_plain= getTextFromHtml (body_html);
      //  body_plain_excerpt=body_plain
       
       //Optional regexp to further trim the digest, remove signature or other legalese we dont want 
           var pattern= /^(.*?)The opinions expressed in the posted.*/igm;    
           var match;        
           while ( match = pattern.exec(body_plain)) {      
            //For some reason I cannot get the subgroup capture, 
            //but I do get the match.index so for the moment it works 
            //by doing a left(). To improve here.
             body_plain_excerpt= body_plain.substring(0,match.index);
       //End of optional section
     }
       
       
       //We append the excerpt to the main digest body string, plus some header information
       digest_body = digest_body + startseparator + crlf + "Date:"+ date_formatted  + crlf + "Subject:" + subject + crlf + body_plain_excerpt + crlf+  endseparator +crlf;
        
    
     }
    }
    
    // We send the email  
    var digest_subject = "Digest of selected emails received in the last 24 hours" + Utilities.formatDate(new Date(), "GMT", "yyyy/M/d");
    Logger.log("log-> " + message);
      var incluye = 'noup';
      if(message.match(/body/)){
        incluye = 'yeah';
      }
     // MailApp.sendEmail(to_emailAddress, digest_subject, incluye);    
    
    
    
    
    //we label the results from the query as Digested to prevent reprocessing
    //Given we rerun the exact query it shouldnt yield different, but have a look if this can be improved
   // var label = GmailApp.getUserLabelByName("Digested");
    /*var threads = GmailApp.search(query);   
    for (var i = 0; i < threads.length; i++) {
         label.addToThread(threads[i]);
       }

   */
    //
    } catch (err) {
    Logger.log("[Error Generating] getMessage: " + err);
     
    }
  Logger.log("[Success] Digest created");

}



/*function getTextFromHtml(html) {
  return getTextFromNode(Xml.parse(html, true).getElement());
}

function getTextFromNode(x) {
  switch(x.toString()) {
    case 'XmlText': return x.toXmlString();
    case 'XmlElement': return x.getNodes().map(getTextFromNode).join('');
    default: return '';
  }
}*/
}