<%@ page language="java" import="java.util.*,ocxkeyboard.*,java.security.interfaces.RSAPrivateCrtKey" pageEncoding="utf-8"%>
<%
	//获得用户名和密码
	String userName = request.getParameter("username");
	String passWord = request.getParameter("password");
	System.out.println(passWord);
	
	
	//获得会话中的随机数和映射表
	String randKey = (String)session.getAttribute("RANDKEY");
	System.out.println("随机数:"+randKey);
	String[] mapArr = (String[])session.getAttribute("MAPARR");
	System.out.println("映射数组:"+Arrays.toString(mapArr));
	session.removeAttribute("RANDKEY");
	session.removeAttribute("MAPARR");
	
	//System.out.println(randKey);
	//System.out.println(Arrays.toString(mapArr));
	//System.out.println(passWord);
	
	//解密AES层
	String rsaStr = AES.decrypt(passWord,randKey);
	System.out.println("RSA密文"+rsaStr);
	
	String filepath=request.getSession().getServletContext().getRealPath("/1.pfx");
	//获得rsa私钥
	RSAPrivateCrtKey rsaPri =RSAUtil.GetPrivateKey1(filepath, "111111");
	//解密RSA层
	String mapStr = RSAUtil.RSADncryptHex(rsaStr,rsaPri);
	System.out.println("映射层密文"+mapStr);
	//解密映射层
	String str = Util.mappingStr(mapArr,mapStr);
	System.out.println("明文"+str);
%>
<!DOCTYPE HTML>
<html>
  <head>
    <title>JS键盘Demo</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<meta name="viewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
   	<style>
   		textarea{
   			width:98%;
   			height:20px;
   		}
   		.high{
   			height:100px;
   		}
   	</style>
  </head>
  
  <body>
  	<h3>解密页面</h3>
	  	<table cellpadding="0" cellspacing="0" border="1" height="100%" width="100%" align="center" style="text-align: center;color: fuchsia;">
	  		<tr>
	  			<td colspan="2">接受的数据</td>
	  		</tr>
	  		<tr>
	  			<td width="10%">
	  				用户名:
	  			</td>
	  			<td width="90%">
	  				<textarea rows="" cols=""><%=userName %></textarea>
	  			</td>
	  		</tr>
	  		<tr>
	  			<td>
	  				密码:
	  			</td>
	  			<td>
	  				<textarea class="high" rows="" cols=""><%=passWord%></textarea>
	  			</td>
	  		</tr>
	  		<tr>
	  			<td colspan="2">解密结果</td>
	  		</tr>
	  		<tr>
	  			<td>
	  				解密AES层:
	  			</td>
	  			<td>
	  				<textarea class="high"  rows="" cols=""><%=rsaStr%></textarea>
	  			</td>
	  		</tr>
	  		<tr>
	  			<td>
	  				解密RSA层:
	  			</td>
	  			<td>
	  				<textarea rows="" cols=""><%=mapStr%></textarea>
	  			</td>
	  		</tr>
	  		<tr>
	  			<td>
	  				解密映射层:
	  			</td>
	  			<td>
	  				<textarea rows="" cols=""><%=str%></textarea>
	  			</td>
	  		</tr>
	  	</table>
  </body>
</html>
