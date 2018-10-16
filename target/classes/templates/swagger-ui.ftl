<!DOCTYPE HTML>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
    <title>Swagger-UI-API接口文档</title>
    <link rel="shortcut icon" href="/images/swagger.ico"/>
    <script type="text/javascript" src="/jquery/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="/jsonview/jquery.jsonview.min.js"></script>
    <script type="text/javascript" src="/layer/layer.js"></script>
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="/ace/ace.min.css"/>
    <link rel="stylesheet" href="/layer/skin/default/layer.css"/>
    <link rel="stylesheet" href="/jsonview/jquery.jsonview.min.css"/>
    <link rel="stylesheet" type="text/css" href="/swagger/SwaggerUI.css"/>
    <script type="text/javascript">var onlineDebug = "${onlineDebug}";</script>
</head>
<body style="overflow:auto;">
<div class="swagger-ui-left" style="height: 100%;overflow-y: auto;">
    <ul class="nav nav-list" id="menu">
        <li>
            <a href="javascript:void(0)">
                <i class="icon-text-width"></i>
                <span class="menu-text"> 简介 </span>
            </a>
        </li>
        <li class="active">
            <a href="#" class="dropdown-toggle">
                <i class="icon-file-alt"></i>
                <span class="menu-text">
                    其他页面
                    <span class="badge badge-primary ">3</span>
                </span>
                <b class="arrow icon-angle-down"></b>
            </a>
            <ul class="submenu">
                <li>
                    <a href="javascript:void(0)">
                        <i class="icon-double-angle-right"></i>
                        帮助
                    </a>
                </li>

                <li>
                    <a href="javascript:void(0)">
                        <i class="icon-double-angle-right"></i>
                        404错误页面
                    </a>
                </li>

                <li>
                    <a href="javascript:void(0)">
                        <i class="icon-double-angle-right"></i>
                        500错误页面
                    </a>
                </li>
            </ul>
        </li>
    </ul>
</div>

<div class="swagger-ui-main" id="content" style="height: 100%;overflow-y: auto; padding-top: 10px;">
    <table class="table table-hover table-bordered table-text-center">
        <thead>
            <tr>
                <th colspan="2" style="text-align:center">${title}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th class="active">项目名称</th>
                <td style="text-align: left">${projectName}</td>
            </tr>
            <tr>
                <th class="active">项目简介</th>
                <td style="text-align: left">${projectNote}</td>
            </tr>
            <tr>
                <th class="active">版本</th>
                <td style="text-align: left">${projectVersion}</td>
            </tr>
            <tr>
                <th class="active">服务器IP地址</th>
                <td style="text-align: left">${serverIp}</td>
            </tr>
            <tr>
                <th class="active">服务URL</th>
                <td style="text-align: left">${serverURL}</td>
            </tr>
        </tbody>
    </table>
</div>
<script type="text/javascript" src="/bootstrap/js/bootstrap.min.js"></script>
<script type="text/javascript" src="/ace/ace.min.js"></script>
<script type="text/javascript" src="/swagger/SwaggerUI.js"></script>
</body>
</html>