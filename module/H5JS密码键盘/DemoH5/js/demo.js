function _$(id){
	return document.getElementById(id);
}
function get_time(){
	return new Date().getTime().toString();
}
/**
 * 登录场景表单提交方法
 */
function formSubmit(){
	//判断密码长度
	if(passGuard1.getLength()==0){
		alert("密码不能为空！");
		return false;
	}
	if(passGuard1.getValid()==1){
		alert("密码不符合要求！");
		return false;
	}
	$.ajax( {
		url : "./send_randkey.jsp?" + get_time(),
		type : "GET",
		async : false,
		success : function(ranKey) {
			passGuard1.setRandKey(ranKey);
		}
	});
	if(passGuard2.getHash() != passGuard3.getHash()){
		alert("新密码和确认密码不一致！");
		return false;
	}
	//获取密文
	_$("password").value = passGuard1.getOutput();
	
	_$("kb1").value = "";
	_$("kb2").value = "";
	_$("kb3").value = "";
	for(var i=1;i<=Le;i++){
		$("#kb"+i).attr('placeholder',arrPlace[i-1])
	}
	//提交
	document.forms[0].submit();
}

/**
 * 修改密码场景表单提交方法
 */
function formSubmit2(){
	//判断密码长度
	if(passGuard1.getLength()==0){
		alert("原密码不能为空！");
		return false;
	}
	if(passGuard2.getLength()==0){
		alert("新密码不能为空！");
		return false;
	}
	if(passGuard3.getLength()==0){
		alert("确认密码不能为空！");
		return false;
	}
	//判断密码是否匹配正则
	if(passGuard2.getValid()==1){
		alert("新密码不符合要求！");
		return false;
	}
	if(passGuard3.getValid()==1){
		alert("确认密码不符合要求！");
		return false;
	}
	//比对新密码和确认密码
	if(passGuard2.getHash()!=passGuard3.getHash()){
		alert("新密码和确认密码不一致！");
		return false;
	}
	$.ajax( {
		url : "./send_randkey.jsp?" + get_time(),
		type : "GET",
		async : false,
		success : function(ranKey) {
			passGuard1.setRandKey(ranKey);
			passGuard2.setRandKey(ranKey);
			passGuard3.setRandKey(ranKey);
		}
	});
	//获取密文
	_$("password").value = passGuard2.getOutput();
	_$("kb1").value = "";
	_$("kb2").value = "";
	_$("kb3").value = "";
	//提交
	//document.forms[0].submit();
}