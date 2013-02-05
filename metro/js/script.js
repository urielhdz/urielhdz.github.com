var f = false;
var bandera = false;
var value1 = 0;
var value2= 0;
var op = '';
$(document).on('ready',function(){
	//var oShell = new ActiveXObject("Shell.Application");
	//oShell.Exec("c:\\windows\\system32\\calc.exe");
      //ws.Exec("c:\\windows\\system32\\calc.exe");
     //var commandtoRun = "calc.exe "; 
//oShell.ShellExecute(commandtoRun, "/INI=c:\\program\\tinsa.ini", 
//"", "open", "1");
	$("#creditos").easydrag();
	//$("#calc").easydrag();
	$("#full").on('click',function(){
		if(!f){
			$("#creditos").animate({
				height: screen.availHeight+'px',
				width: screen.availWidth+'px',
				top: '0px',
				left: '0px'
			},500);	
			f=true;
		}else{
			$("#creditos").animate({
				height: 250+'px',
				width: 300+'px'
			},500);
			f=false;	
		}
	});
	$('#closeCre').on('click',function(){
		$('#creditos').hide('slow');
	});
	$('#closeCalc').on('click',function(){
		$('#calc').hide('slow');
	});
	$('.openCr').on('click',function(){
		$('#pantallaInicio').hide('fast');
		$('#creditos').show('slow');
	});
	$('.openCalc').on('click',function(){
		$('#pantallaInicio').hide('fast');
		$('#calc').show('slow');
	});
	$('.wincalc').on('click',function(){	
		$('#pantallaInicio').hide('slow');
		openCalc();
	});
	$('#inicio').on('click',function(){
		$('#pantallaInicio').show('fast');
	});
	$('#close').on('click',function(){
		$('#pantallaInicio').hide('fast');
	});
	for(var i = 0;i<10;i++){
		var toAdd = "<button id='"+i+"' class='btnN'>"+i+"</button>"
		var current = $('#botones').html();
		$('#botones').html(current + toAdd);
	}
	$('.btnN').on('click',function(e){
		console.log(':P');
		if(!bandera){
			value1 = (value1*10) + parseInt(e.target.id);
			$('#resultado').val(value1);
		}
		else{
			value2 = (value2*10) + parseInt(e.target.id);	
			$('#resultado').val(value2);
		}
	});
	$('.btnO').on('click',function(e){
		op = $(this).data('operacion');
		if(!bandera){
			bandera = true;
			$('#resultado').val('');
		}
		else{
			switch(op){
				case 'a':
					$('#resultado').val(value1+value2);
					break;
				case 'b':
					$('#resultado').val(value1-value2);
					break;
				case 'c':
					$('#resultado').val(value1*value2);
					break;
				case 'd':
					$('#resultado').val(value1/value2);
					break;
				case 'e':
					$('#resultado').val(value1%value2);
					break;
			}
		}
	});
	$('#igual').on('click',function(){
		console.log('asd');
		switch(op){
				case 'a':
					$('#resultado').val(value1+value2);
					break;
				case 'b':
					$('#resultado').val(value1-value2);
					break;
				case 'c':
					$('#resultado').val(value1*value2);
					break;
				case 'd':
					$('#resultado').val(value1/value2);
					break;
				case 'e':
					$('#resultado').val(value1%value2);
					break;
				default:
					$('#resultado').val('0');
			}
			value1 = 0;
			value2=0;
			bandera=false;
	});
});
function openCalc(){
	var objShell = new ActiveXObject("WScript.Shell");
	objShell.run("calc.exe");
}

/* Calculadora */ 


