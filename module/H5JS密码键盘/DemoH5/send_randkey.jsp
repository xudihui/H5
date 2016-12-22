<%@page language="java" pageEncoding="utf-8" import="ocxkeyboard.Util"%>
<%
	String mcrypt_key = Util.getRandomKey(32).trim();
	session.setAttribute("RANDKEY", mcrypt_key);
	out.clear();
	out.print(mcrypt_key);
%>
