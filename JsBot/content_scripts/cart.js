//we are in /checkout

var get = ['name', 'email', 'phone', 'address', 'address2', 'zip', 'city', 'state', 'country',
  'card_type', 'card_number', 'exp_mon', 'exp_yr', 'cvv', 'buy_auto', 'running', 'checkout_delay'];

chrome.storage.sync.get(get, res => {

  setTimeout( () => {
  //billing and shipping
  $('#order_billing_name').val(res.name);
  $('#order_email').val(res.email);
  $('#order_tel').val(res.phone);
  $('#bo').val(res.address);
  $('#oba3').val(res.address2);
  $('#order_billing_zip').val(res.zip);
  $('#order_billing_city').val(res.city);

  let country = res.country;
  $('#order_billing_country').val(country);
  $("#state_label").text(country === 'USA' ? 'state' : 'province');
  $('#order_billing_state').html($('#states-' + country).html())
  $('#order_billing_state').val(res.state);

  $('#credit_card_type').val(res.card_type);

  $(':contains(number)').next().val(res.card_number)

  $('#credit_card_month').val(res.exp_mon);
  $('#credit_card_year').val(res.exp_yr);

  setTimeout(()=>{
    $('#order_billing_country').change()
  }, 2000)

  //Add the CVV char by char on an interval
  var addLetter = (i) => {
    $(cvv_input).val($(cvv_input).val() + res.cvv[i])
  }

  var cvvInputs = [];
  cvv_input = $( ":contains('CVV')", ".string", ".required" )[0].nextSibling
  for (i = 0; i < res.cvv.length; i++) {
    //Push a bound function into an array so we can call them on an interval
    const toInput = addLetter.bind(null, i);
    cvvInputs.push(toInput);
  }

  //Execute each function in the array LIFO on an interval, clear the interval once it's done
  var interval = setInterval(() => {
    const toExecute = cvvInputs.shift();
    if (toExecute) {
      toExecute();
    } else {
      window.clearInterval(interval);
    }
  }, 50);

  $('#order_terms').click();
  $('.iCheck-helper').click();

  if(res.buy_auto){
    //warning if buy_auto on this will finish payment
    $('[name="commit"]').click()
  }
  chrome.runtime.sendMessage({type: "off"}, function(res){});
  }, parseInt(res.checkout_delay) * 1000);

});
