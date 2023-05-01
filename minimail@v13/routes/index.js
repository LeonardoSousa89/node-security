const { 
  signup, 
  login, 
  logout 
}=require('../services/clientService')

const {  
  authorizedClient,
  sendMail,
  sendedMail,
  receivedMail,
  deleteSendedEmailById,
  deleteAllSendedEmail,
  deleteReceivedEmailById,
  deleteAllReceivedEmail
}=require('../services/mailService')

const express=require('express')

var router=express.Router();

router.route('/signup').post(function(req, res) {

  signup(req, res)
})

router.route('/login').post(function(req, res) {
  
  login(req, res)
})

router.route('/signout').post(function(req, res) {
  
  logout(req, res)
})

router.route('/send/user/:id').post(authorizedClient, function(req, res) {
  
  sendMail(req, res)
});

router.route('/sendbox/:id/user').get(authorizedClient, function(req, res) {
  
  sendedMail(req, res)
});

router.route('/sendbox/:id/user/delete').delete(authorizedClient, function(req, res) {
  
  deleteSendedEmailById(req, res)
});

router.route('/sendbox/:id/user/delete-all').delete(authorizedClient, function(req, res) {
  
  deleteAllSendedEmail(req, res)
});

router.route('/inbox/:id/user').get(authorizedClient, function(req, res) {
  
  receivedMail(req, res)
});

router.route('/inbox/:id/user/delete').delete(authorizedClient, function(req, res) {
  
  deleteReceivedEmailById(req, res)
});

router.route('/inbox/:id/user/delete-all').delete(authorizedClient, function(req, res) {
  
  deleteAllReceivedEmail(req, res)
});

module.exports=router
