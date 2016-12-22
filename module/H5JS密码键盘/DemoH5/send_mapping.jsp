<%@page language="java" pageEncoding="utf-8"
	import="java.util.*,ocxkeyboard.Util"%>
<%
	String[] mArr = Util.getMappingString();
	String mString = Util.getBase64(Arrays.toString(mArr)).trim();
	session.setAttribute("MAPARR", mArr);
	out.clear();
	out.print(mString);
%>