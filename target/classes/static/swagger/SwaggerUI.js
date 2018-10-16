/**
 * 由于原生swagger页面交互不太友好并且功能不够强大，所以开发一套基于bootstrap的新交互页面替换原生swagger页面
 * Created by guoguifang on 2018/3/1.
 */
(function ($) {
    //初始化类
    var SwaggerApiUI = {};

    SwaggerApiUI.init = function () {
        SwaggerApiUI.createGroupTab();
    };

    /**
     * 创建分组
     */
    SwaggerApiUI.createGroupTab = function () {
        $.ajax({
            url: "swagger-resources",
            type: "get",
            async: false,
            success: function (data) {
                if (!(data instanceof Array)) {
                    data = $.parseJSON(data);
                }
                //获取分组名称
                SwaggerApiUI.initGroupSele(data);
            }
        });
    };

    /**
     * 初始化分组菜单
     */
    SwaggerApiUI.initGroupSele = function (groupData) {
        //创建分组flag
        var groupli = $('<li class="active"></li>');
        var groupSele = $("<select id='groupSel' style='width:100%;'></select>");
        $.each(groupData, function (i, group) {
            var groupOption = $("<option data-url='" + group.location + "' data-name='" + group.name + "'>" + group.name + "</option>");
            groupSele.append(groupOption);
        });
        groupli.append(groupSele);
        groupSele.on("change", function () {
            SwaggerApiUI.initApiTree($(this).find("option:selected").attr("data-url"));
        });
        SwaggerApiUI.getMenu().html("");
        SwaggerApiUI.getMenu().append(groupli);
        var url = groupData[0].location;
        //默认加载第一个url
        SwaggerApiUI.initApiTree(url);
    };

    /**
     * 创建面板
     */
    SwaggerApiUI.creatabTab = function () {
        var divcontent = $('<div id="myTab" class="tabs-container" style="width:99%;margin:0 auto;"></div>');
        var tabcontent = $('<div class="tab-content" style="background-color: #fff;"></div>');
        var ul = $('<ul class="nav nav-tabs"></ul>');
        var tab1_nav = $('<li id="tab1_nav" class="active"></li>');
        var tab1_a = $('<a href="javascript:void(0);"> 接口说明</a>');
        tab1_nav.append(tab1_a);
        ul.append(tab1_nav);
        tabcontent.append($('<div id="tab1" class="tab-pane" style="display: block;"><div class="panel-body"><strong>接口详细说明</strong><p>暂无</p></div></div>'));

        if (onlineDebug && onlineDebug == "true") {
            var tab2_nav = $('<li id="tab2_nav""></li>');
            var tab2_a = $('<a href="javascript:void(0);"> 在线调试</a>');
            tab1_a.click(function () {
                $("#tab1_nav").addClass("active");
                $("#tab2_nav").removeClass("active");
                $("#tab1").show();
                $("#tab2").hide();
            });
            tab2_a.click(function () {
                $("#tab2_nav").addClass("active");
                $("#tab1_nav").removeClass("active");
                $("#tab2").show();
                $("#tab1").hide();
            });
            tab2_nav.append(tab2_a);
            ul.append(tab2_nav);
            tabcontent.append($('<div id="tab2" class="tab-pane"><div class="panel-body"><strong>暂无</strong></div></div>'));
        }

        divcontent.append(ul);
        divcontent.append(tabcontent);
        //内容覆盖
        SwaggerApiUI.getDoc().html("");
        SwaggerApiUI.getDoc().append(divcontent);
    };

    /**
     * 检查对象属性,in并赋予默认值
     */
    SwaggerApiUI.getValue = function (obj, key, defaultValue, checkEmpty) {
        var val = defaultValue;
        if (obj != null && obj != undefined && obj.hasOwnProperty(key)) {
            val = obj[key];
            if (checkEmpty && (val == null || val == "")) {
                val = defaultValue;
            }
        }
        return val;
    };

    /**
     * 创建简介table页面
     */
    SwaggerApiUI.createDescription = function (menu) {
        var table = $('<table class="table table-bordered table-text-center" style="background-color: #fff; width: 90%;margin: auto; font-size: 14px;"></table>');
        var title = "", description = "", name = "", version = "", termsOfService = "";
        var host = SwaggerApiUI.getValue(menu, "host", "", true);
        if (menu.hasOwnProperty("info")) {
            var info = menu.info;
            title = SwaggerApiUI.getValue(info, "title", "Swagger-Bootstrap-UI-前后端api接口文档", true);
            description = SwaggerApiUI.getValue(info, "description", "", true);
            if (info.hasOwnProperty("contact")) {
                var contact = info["contact"];
                name = SwaggerApiUI.getValue(contact, "name", "", true);
            }
            version = SwaggerApiUI.getValue(info, "version", "", true);
            termsOfService = SwaggerApiUI.getValue(info, "termsOfService", "", true);
        }
        //修改title
        $("title").html("").html(title);
        table.append($('<thead><tr style="height: 80px;"><th colspan="2" style="text-align:center; font-size: 25px;">' + title + '</th></tr></thead>'));
        var tbody = $('<tbody></tbody>');
        tbody.append($('<tr style="height: 60px;"><th class="table-primary" style="vertical-align: middle; width: 20%;">简介</th><td style="text-align: left">' + description + '</td></tr>'));
        tbody.append($('<tr style="height: 60px;"><th class="table-primary" style="vertical-align: middle;">作者</th><td style="text-align: left">' + name + '</td></tr>'));
        tbody.append($('<tr style="height: 60px;"><th class="table-primary" style="vertical-align: middle;">版本</th><td style="text-align: left">' + version + '</td></tr>'));
        tbody.append($('<tr style="height: 60px;"><th class="table-primary" style="vertical-align: middle;">host</th><td style="text-align: left">' + host + '</td></tr>'));
        tbody.append($('<tr style="height: 60px;"><th class="table-primary" style="vertical-align: middle;">服务url</th><td style="text-align: left">' + termsOfService + '</td></tr>'));
        table.append(tbody);
        var div = $('<div style="width:99%;margin:0 auto;"></div>');
        div.css("height", ($(window).height() - 10) + "px");
        var paddingTopHeight = ($(window).height() - 400) / 6;
        if (paddingTopHeight < 0) {
            paddingTopHeight = 0;
        }
        div.css("padding-top", paddingTopHeight + "px");
        div.append(table);
        //内容覆盖
        SwaggerApiUI.getDoc().html("");
        SwaggerApiUI.getDoc().append(div);
        SwaggerApiUI.getDoc().data("data", menu);
    };

    /***
     * 获取菜单结构
     */
    SwaggerApiUI.getMenuConstructs = function () {
        return SwaggerApiUI.getDoc().data("data");
    };

    SwaggerApiUI.toString = function (obj, defaultStr) {
        if (obj != null && typeof (obj) != "undefined") {
            return obj.toString();
        }
        if (obj == undefined) {
            return defaultStr;
        }
        return defaultStr;
    };

    SwaggerApiUI.initApiTree = function (url) {
        var idx = url.indexOf("/");
        if (idx == 0) {
            url = url.substr(1);
        }
        $.ajax({
            url: url,
            dataType: "json",
            type: "get",
            async: false,
            success: function (data) {
                var menu = data;
                SwaggerApiUI.definitions(menu);
                SwaggerApiUI.createDescription(menu);
                SwaggerApiUI.createDetailMenu(menu);
            }
        });
    };

    /***
     * 创建分组详情菜单
     */
    SwaggerApiUI.createDetailMenu = function (menu) {
        SwaggerApiUI.getMenu().find(".detailMenu").remove();

        //简介li
        var dli = $('<li  class="active detailMenu"><a href="javascript:void(0)"><i class="icon-text-width"></i><span class="menu-text"> 简介 </span></a></li>');
        dli.on("click", function () {
            SwaggerApiUI.createDescription(menu);
            $(".nav-list").find("li").find("ul").find(".active").removeClass("active");
            dli.addClass("active");
        });
        SwaggerApiUI.getMenu().append(dli);
        var methodApis = SwaggerApiUI.eachPath(menu);

        if (menu.tags) {
            $.each(menu.tags, function (i, tag) {
                var tagInfo = new TagInfo(tag.name, tag.description);
                //查找childrens
                $.each(methodApis, function (i, methodApi) {
                    //判断tags是否相同
                    $.each(methodApi.tag, function (i, tagName) {
                        if (tagName == tagInfo.name) {
                            tagInfo.childrens.push(methodApi);
                        }
                    })
                });
                var len = tagInfo.childrens.length;
                var name = tagInfo.name;
                if (name.indexOf("-$$") > -1) {
                    name = name.substr(0, name.indexOf("-$$"));
                }
                name = name.replace("-rest", "");
                name = name.replace("-controller", "");
                name = name.replace("-v-", "-v");
                var title = "";
                if (name.length > 22) {
                    title = name;
                    name = name.substr(0, 20) + "...";
                }
                if (len == 0) {
                    SwaggerApiUI.getMenu().append($('<li class="detailMenu"><a href="javascript:void(0)" title="' + title + '"><i class="icon-text-width"></i><span class="menu-text"> ' + name + ' </span></a></li>'));
                } else {
                    //存在子标签
                    if (len >= 0 && len < 10) {
                        len = "0" + len;
                    }
                    var li = $('<li  class="detailMenu"></li>');
                    var titleA = $('<a href="#" class="dropdown-toggle" title="' + title + '"><i class="icon-file-alt"></i><span class="menu-text">' + name + '<span class="badge badge-primary" style="top:8px;">' + len + '</span></span><b class="arrow icon-angle-down"></b></a>');
                    li.append(titleA);
                    //循环树
                    var ul = $('<ul class="submenu"></ul>');
                    $.each(tagInfo.childrens, function (i, children) {
                        var methodType = children.methodType.toUpperCase();
                        var url = children.url;
                        var summary = children.summary;
                        var childrenLi = $('<li class="menuLi" title="' + methodType + '-' + url + '&#10;' + summary + '"><div class="mhed"><div>' + methodType + '-<code>' + url + '</code></div><div class="text-truncate">' + summary + '</div></div></li>');
                        childrenLi.data("data", children);
                        ul.append(childrenLi);
                    });
                    li.append(ul);
                    SwaggerApiUI.getMenu().append(li);
                }
            });
        }
        SwaggerApiUI.initLiClick();
    };


    SwaggerApiUI.eachPath = function (menu) {
        var paths = menu.paths;
        //paths是object对象,key是api接口地址,
        var methodApis = [];
        for (var key in paths) {
            var obj;
            var apiInfo;
            if (paths.hasOwnProperty(key)) {
                obj = paths[key];
            }
            //遍历obj,获取api接口访问方式
            if (obj.hasOwnProperty("get")) {
                apiInfo = new ApiInfo(obj["get"]);
                apiInfo.methodType = "get";
                apiInfo.url = key;
                methodApis.push(apiInfo);
            }
            if (obj.hasOwnProperty("post")) {
                apiInfo = new ApiInfo(obj["post"]);
                apiInfo.methodType = "post";
                apiInfo.url = key;
                methodApis.push(apiInfo);
            }
            if (obj.hasOwnProperty("put")) {
                apiInfo = new ApiInfo(obj["put"]);
                apiInfo.methodType = "put";
                apiInfo.url = key;
                methodApis.push(apiInfo);
            }
            if (obj.hasOwnProperty("delete")) {
                apiInfo = new ApiInfo(obj["delete"]);
                apiInfo.methodType = "delete";
                apiInfo.url = key;
                methodApis.push(apiInfo);
            }
        }
        return methodApis;
    };

    /**
     * li标签click事件
     */
    SwaggerApiUI.initLiClick = function () {
        SwaggerApiUI.getMenu().find(".menuLi").bind("click", function (e) {
            e.preventDefault();
            var that = $(this);
            var data = that.data("data");
            //获取parent-Li的class属性值
            SwaggerApiUI.getMenu().find("li").removeClass("active");
            that.addClass("active");
            SwaggerApiUI.createApiInfoTable(data);
            if (onlineDebug && onlineDebug == "true") {
                SwaggerApiUI.createDebugTab(data);
            }
        });
    };

    SwaggerApiUI.getStringValue = function (obj) {
        var str = "";
        if (typeof (obj) != 'undefined' && obj != null) {
            str = obj.toString();
        }
        return str;
    };

    /**
     * 格式化json
     */
    function formatterJson(text_value) {
        var res = "";
        for (var i = 0, j = 0, k = 0, ii, ele; i < text_value.length; i++) {//k:缩进，j:""个数
            ele = text_value.charAt(i);
            if (j % 2 == 0 && ele == "}") {
                k--;
                for (ii = 0; ii < k; ii++) ele = "    " + ele;
                ele = "\n" + ele;
            }
            else if (j % 2 == 0 && ele == "{") {
                ele += "\n";
                k++;
                for (ii = 0; ii < k; ii++) ele += "    ";
            }
            else if (j % 2 == 0 && ele == ",") {
                ele += "\n";
                for (ii = 0; ii < k; ii++) ele += "    ";
            }
            else if (ele == "\"") j++;
            res += ele;
        }
        return res;
    }

    SwaggerApiUI.btnRequestDefaultValue = "Send";
    /**
     * 创建调试面板
     */
    SwaggerApiUI.createDebugTab = function (apiInfo) {
        //方法、请求类型、发送按钮
        var div = $('<div style="width: 100%;margin: 0 auto;"></div>');
        var headdiv1 = $('<div class="input-group" style="margin: 10px 0 0 0;"></div>');
        headdiv1.append($('<span class="input-group-btn"><button class="btn btn-lg btn-info" type="button" style="font-family:Consolas, monospace;border-top-left-radius:25px;border-bottom-left-radius:25px;width:160px;">&nbsp;' + initial(SwaggerApiUI.getStringValue(apiInfo.methodType)) + '</button></span>'));
        headdiv1.append($('<span id="txtreqUrl" class="form-control" style="font-size: 20px; line-height: 36px; font-family:Consolas, monospace; background-color:#E6E6E6;color:#e83e8c;">' + SwaggerApiUI.getStringValue(apiInfo.url) + '</span>'));
        headdiv1.append($('<span class="input-group-btn"><button id="btnRequest" class="btn btn-lg btn-primary" type="button" style="font-family:微软雅黑,monospace;border-top-right-radius:25px;border-bottom-right-radius:25px;width:160px;text-align:center;letter-spacing:1px;">' + SwaggerApiUI.btnRequestDefaultValue + '</button></span>'));
        div.append(headdiv1);
        //请求参数
        var divp = $('<div class="panel panel-primary" style="width: 97%; margin: 25px auto; border: 1px solid #337ab7;"><div class="panel-heading">请求参数</div></div>');
        var divpbody = $('<div class="panel-body" style="margin: 10px;"></div>');
        //是否是文件上传
        var fileform = false;
        //判断是否有请求参数
        if (typeof (apiInfo.parameters) != 'undefined' && apiInfo.parameters != null) {
            var table = $('<table class="table table-hover table-bordered table-text-center"></table>');
            var thead = $('<thead><tr><th></th><th>参数名称</th><th>参数值</th><th>操作</th></tr></thead>');
            table.append(thead);
            var tbody = $('<tbody id="paramBody"></tbody>');
            $.each(apiInfo.parameters, function (i, param) {
                var tr = $('<tr></tr>');
                tr.data("data", param);
                //判断parame的in类型
                var checkbox = $('<td width="7%"><div class="checkbox"><input type="checkbox" value="" checked style="width: 15px;height: 15px;"></div></td>');
                var key = $('<td width="17%"><span class="form-control p-key" style="border: 0;">' + param.name + '</span></td>');
                var value = $('<td></td>');

                var val = null;
                if (param["in"] == "body") {
                    tbody.attr("reqtype", "body");
                    val = $('<textarea class="form-control jsonview" style="resize: none; width: 100%; border: 0;" data-apiUrl="' + apiInfo.url + '" name="' + param.name + '" data-name="' + param.name + '" placeholder="' + SwaggerApiUI.getStringValue(param['description']) + '"></textarea>');
                    //判断是否有schma
                    if (param.hasOwnProperty("schema")) {
                        var schema = param["schema"];
                        var ref = schema["$ref"];
                        var regex = new RegExp("#/definitions/(.*)$", "ig");
                        if (regex.test(ref)) {
                            var refType = RegExp.$1;
                            //这里判断refType是否是MultipartFile类型,如果是该类型,上传组件
                            if (refType == "MultipartFile") {
                                fileform = true;
                                val = $('<input name="' + param.name + '" type="file" class="form-control p-value" data-apiUrl="' + apiInfo.url + '" data-name="' + param.name + '" placeholder="' + SwaggerApiUI.getStringValue(param['description']) + '"/>');
                            } else {
                                var requestDefinition = "&nbsp;";
                                var deftion = SwaggerApiUI.getRequestDefinition(refType);
                                var deftionLength = Object.getOwnPropertyNames(deftion).length;
                                if (deftion != null) {
                                    requestDefinition = formatterJson(JSON.stringify(deftion));
                                }
                                val.val(requestDefinition);
                                val.css("height", ((deftionLength + 2) * 22 + 10) + "px");
                            }
                        }
                    }
                } else {
                    val = $('<input class="form-control p-value" name="' + param.name + '" data-apiUrl="' + apiInfo.url + '" data-name="' + param.name + '" placeholder="' + SwaggerApiUI.getStringValue(param['description']) + '"/>');
                    //判断是否有defaultvalue
                    if (param.hasOwnProperty("default")) {
                        var defaultValue = param["default"];
                        val.val(defaultValue);
                    }
                    //这里判断param类型,如果是int类型,只能输入数字
                }
                value.append(val);
                var oper = $('<td width="7%"><button class="btn btn-warn btn-circle btn-lg" type="button"><strong>×</strong></button></td>');
                //删除事件
                oper.find("button").on("click", function (e) {
                    e.preventDefault();
                    var that = $(this);
                    var a = that.parent();
                    var b = a.parent();
                    that.parent().parent().remove();
                });
                //判断参数类型,针对path参数
                if (param["in"] == "path") {
                    //赋予change事件
                    value.find("input").on("keyup", function () {
                        var t = $(this);
                        var name = t.data("name");
                        var apiUrl = t.attr("data-apiUrl");
                        var realValue = apiUrl.replace("{" + name + "}", t.val());
                        //查找是否还存在其他path参数
                        $("#paramBody").find("tr").each(function () {
                            var itrthat = $(this);
                            var itrdata = itrthat.data("data");
                            var itrname = itrdata["name"];
                            if (itrdata["in"] == "path" && itrdata["name"] != name) {
                                //查找value值
                                var itrtdvalue = itrthat.find(".p-value").val();
                                if (itrtdvalue != "") {
                                    realValue = realValue.replace("{" + itrname + "}", itrtdvalue);
                                }
                            }
                        });
                        $("#txtreqUrl").val(realValue);
                    })
                }
                tr.append(checkbox).append(key).append(value).append(oper);
                tbody.append(tr);
            });
            table.append(tbody);
            //如果有文件上传,追加form表单
            if (fileform) {
                //文件上传使用相对路径
                var uploadurltemp = apiInfo.url;
                if (uploadurltemp.indexOf("/") == 0) {
                    uploadurltemp = uploadurltemp.substr(1);
                }
                var form = $('<form id="uploadForm"  target="uploadIframe" action="' + uploadurltemp + '" type="" enctype="multipart/form-data" method="' + apiInfo.methodType + '"></form>');
                form.append(table);
                divpbody.append(form);
            } else {
                divpbody.append(table);
            }
        } else {
            divpbody.append($('<strong>暂无参数</strong>'))
        }
        divp.append(divpbody);
        //
        if (fileform) {
            //追加iframe
            var resptabframe = $('<div id="resptab" class="tabs-container" ><iframe name="uploadIframe" id="uploadIframe" style="border: none;height: 1%;display: none;"></iframe></div>');
            divp.append(resptabframe);
        }
        div.append(divp);
        //创建reesponsebody
        var responseBodyDiv = $('<div id="responsebody" class="panel panel-primary" style="width: 97%; margin: auto; border: 1px solid #337ab7; display: none;"><div class="panel-heading">响应信息</div></div>');
        var respcleanDiv = $('<div class="panel-body" style="margin: 10px;"></div>');
        responseBodyDiv.append(respcleanDiv);
        div.append(responseBodyDiv);
        SwaggerApiUI.getDoc().find("#tab2").find(".panel-body").html("");
        SwaggerApiUI.getDoc().find("#tab2").find(".panel-body").append(div);
        //发送事件
        var requestBtn = headdiv1.find("#btnRequest");
        requestBtn.bind("click", function (e) {
            e.preventDefault();
            responseBodyDiv.hide();
            respcleanDiv.html("");
            var params = {};
            var headerparams = {};
            var bodyparams = "";
            //增加表单验证
            var validateflag = false;
            var validateobj = {};

            //获取参数
            var paramBody = SwaggerApiUI.getDoc().find("#tab2").find("#paramBody");
            //组装请求url
            var url = SwaggerApiUI.getStringValue(apiInfo.url);
            var cacheData = SwaggerApiUI.getDoc().data("data");
            if (typeof (cacheData.basePath) != "undefined" && cacheData.basePath != "") {
                if (cacheData.basePath != "/") {
                    url = cacheData.basePath + SwaggerApiUI.getStringValue(apiInfo.url);
                }
            }
            paramBody.find("tr").each(function () {
                var paramtr = $(this);
                var cked = paramtr.find("td:first").find(":checked").prop("checked");
                if (cked) {
                    //如果选中
                    var trdata = paramtr.data("data");
                    //获取key
                    //var key=paramtr.find("td:eq(1)").find("input").val();
                    var key = trdata["name"];
                    //获取value
                    var value = "";
                    if (trdata["in"] == "body") {
                        value = paramtr.find("td:eq(2)").find("textarea").val();
                        //这里需要判断schema
                        if (trdata.hasOwnProperty("schema")) {
                            var schema = trdata["schema"];
                            if (schema.hasOwnProperty("$ref")) {
                                var ref = schema["$ref"];
                                var regex = new RegExp("#/definitions/(.*)$", "ig");
                                if (regex.test(ref)) {
                                    var refType = RegExp.$1;
                                    //这里判断refType是否是MultipartFile类型,如果是该类型,上传组件
                                    if (refType == "MultipartFile") {
                                        value = paramtr.find("td:eq(2)").find("input").val();
                                    }
                                }
                            }
                        }
                    } else {
                        value = paramtr.find("td:eq(2)").find("input").val();
                    }
                    //var value=paramtr.find("td:eq(2)").find("input").val();
                    //delete方式参数url传递
                    if (apiInfo.methodType == "delete") {
                        //判断是否是path参数
                        if (trdata["in"] == "path") {
                            url = url.replace("{" + key + "}", value);
                        } else {
                            if (url.indexOf("?") > -1) {
                                url = url + "&" + key + "=" + value;
                            } else {
                                url += "?" + key + "=" + value;
                            }
                        }
                    } else {
                        if (trdata["in"] == "path") {
                            url = url.replace("{" + key + "}", value);
                        } else {
                            if (trdata["in"] == "body") {
                                bodyparams += value;
                            } else {
                                if (trdata["in"] == "header") {
                                    headerparams[key] = value;
                                } else {
                                    params[key] = value;
                                }
                            }
                        }
                    }
                    //判断是否required
                    if (trdata.hasOwnProperty("required")) {
                        var required = trdata["required"];
                        if (required) {
                            //必须,验证value是否为空
                            if (value == null || value == "") {
                                validateflag = true;
                                var des = trdata["name"];
                                validateobj = {message: des + "不能为空"};
                                return false;
                            }
                        }
                    }
                }
            });
            var reqdata = null;
            var contType = "application/json; charset=UTF-8";
            if (paramBody.attr("reqtype") != null && paramBody.attr("reqtype") != undefined && paramBody.attr("reqtype") == "body") {
                reqdata = bodyparams;
            } else {
                reqdata = params;
                contType = "application/x-www-form-urlencoded; charset=UTF-8";
            }
            if (validateflag) {
                layer.msg(validateobj.message);
                return;
            }
            //判断是否有表单
            var form = $("#uploadForm");
            requestBtn.attr("disabled", true);
            requestBtn.html("Waiting.");
            requestBtn.css("text-align", "left");
            var times = 1;
            var intervalId = setInterval(function () {
                requestBtn.html("Waiting" + getPoint(times++));
            }, 1000);
            var startTime = new Date().getTime();
            if (form.length > 0) {
                form[0].submit();
                //iframe监听change事件
                $("#uploadIframe").on("load", function () {
                    $(this).unbind('load');
                    var framebody = $(this).contents().find("body");
                    var ret = framebody.html();
                    //是否存在pre标签
                    if (framebody.find("pre").length > 0) {
                        ret = framebody.find("pre").html();
                    }
                    try {
                        var res = JSON.parse(ret);
                        var resptab = $('<div id="resptab" class="tabs-container" ></div>');
                        var ulresp1 = $('<ul class="nav nav-tabs"><li class=""><a data-toggle="tab" href="#tabresp" aria-expanded="false"> 响应内容 </a></li></ul>');
                        resptab.append(ulresp1);
                        var respcontent = $('<div class="tab-content"></div>');
                        var resp1 = $('<div id="tabresp" class="tab-pane active"><div class="panel-body"></div></div>');
                        respcontent.append(resp1);
                        resptab.append(respcontent);
                        respcleanDiv.append(resptab);
                        var jsondiv = $('<div></div>');
                        jsondiv.JSONView(res);
                        resp1.find(".panel-body").append(jsondiv);
                        resptab.find("a:first").tab("show");
                    } catch (err) {
                        respcleanDiv.html(ret);
                    }
                    responseBodyDiv.show();
                    requestBtn.attr("disabled", false);
                    requestBtn.html(SwaggerApiUI.btnRequestDefaultValue);
                    requestBtn.css("text-align", "center");
                    clearInterval(intervalId);
                })
            } else {
                $.ajax({
                    url: url,
                    headers: headerparams,
                    type: SwaggerApiUI.getStringValue(apiInfo.methodType),
                    data: reqdata,
                    contentType: contType,
                    success: function (data, status, xhr) {
                        var resptab = $('<div id="resptab" class="tabs-container"></div>');
                        var ulrespDiv = $('<div class="panel-body" style="height:31px;"></div>');
                        var ulresp1 = $('<ul class="nav nav-tabs" style="float:left;"></ul>');
                        var ulresp2 = $('<ul class="nav nav-tabs" style="float:right;"></ul>');

                        var liresp1 = $('<li id="liresp1" class="active"><a href="javascript:void(0);"> 响应内容 </a></li>');
                        var liresp2 = $('<li id="liresp2"><a href="javascript:void(0);"> Cookies </a></li>');
                        var liresp3 = $('<li id="liresp3"><a href="javascript:void(0);"> Headers </a></li>');
                        var liresp4 = $('<li id="liresp4" style="margin-right: 30px;"></li>');
                        var liresp5 = $('<li id="liresp5" style="margin-right: 50px;"><span class="glyphicon glyphicon-time" aria-hidden="true"></span>  ' + getExecuteTime(startTime, new Date()) + '</li>');

                        liresp1.click(function () {
                            $("#liresp1").addClass("active");
                            $("#liresp2").removeClass("active");
                            $("#liresp3").removeClass("active");
                            $("#tabresp").show();
                            $("#tabcookie").hide();
                            $("#tabheader").hide();
                        });
                        liresp2.click(function () {
                            $("#liresp1").removeClass("active");
                            $("#liresp2").addClass("active");
                            $("#liresp3").removeClass("active");
                            $("#tabresp").hide();
                            $("#tabcookie").show();
                            $("#tabheader").hide();
                        });
                        liresp3.click(function () {
                            $("#liresp1").removeClass("active");
                            $("#liresp2").removeClass("active");
                            $("#liresp3").addClass("active");
                            $("#tabresp").hide();
                            $("#tabcookie").hide();
                            $("#tabheader").show();
                        });

                        ulresp1.append(liresp1);
                        ulresp1.append(liresp2);
                        ulresp1.append(liresp3);
                        ulresp2.append(liresp4);
                        ulresp2.append(liresp5);
                        ulrespDiv.append(ulresp1);
                        ulrespDiv.append(ulresp2);
                        resptab.append(ulrespDiv);
                        var respcontent = $('<div class="tab-content"></div>');

                        var resp1 = $('<div id="tabresp" class="tab-pane active"><div class="panel-body"><pre></pre></div></div>');
                        var resp2 = $('<div id="tabcookie" class="tab-pane"><div class="panel-body">暂无</div>');
                        var resp3 = $('<div id="tabheader" class="tab-pane"><div class="panel-body">暂无</div></div>');

                        respcontent.append(resp1).append(resp2).append(resp3);
                        resptab.append(respcontent);
                        respcleanDiv.append(resptab);
                        var allheaders = xhr.getAllResponseHeaders();
                        if (allheaders != null && typeof (allheaders) != 'undefined' && allheaders != "") {
                            var headers = allheaders.split("\r\n");
                            var headertable = $('<table class="table table-hover table-bordered table-text-center"><thead><tr><th style="width: 30%;">响应头</th><th>响应值</th></tr></thead></table>');
                            for (var i = 0; i < headers.length; i++) {
                                var header = headers[i];
                                if (header != null && header != "") {
                                    var headerValu = header.split(":");
                                    var headertr = $('<tr><th class="table-active">' + headerValu[0] + '</th><td>' + headerValu[1] + '</td></tr>');
                                    headertable.append(headertr);
                                }
                            }
                            //设置Headers内容
                            resp3.find(".panel-body").html("");
                            resp3.find(".panel-body").append(headertable);
                        }
                        var contentType = xhr.getResponseHeader("Content-Type");
                        if (xhr.hasOwnProperty("responseJSON")) {
                            //如果存在该对象,服务端返回为json格式
                            resp1.find(".panel-body").html("");
                            var jsondiv = $('<div></div>');
                            var responseJSON = xhr["responseJSON"];
                            liresp4.html("<span class='glyphicon glyphicon-file'></span>   " + getByteCount(responseJSON));
                            jsondiv.JSONView(responseJSON);
                            resp1.find(".panel-body").append(jsondiv);
                        } else {
                            //判断content-type
                            //如果是image资源
                            var regex = new RegExp('image/(jpeg|jpg|png|gif)', 'g');
                            if (regex.test(contentType)) {
                                var d = SwaggerApiUI.getDoc().data("data");
                                var imgUrl = "http://" + d.host + apiInfo.url;
                                var img = document.createElement("img");
                                img.onload = function () {
                                    // 清除释放
                                    window.URL.revokeObjectURL(img.src);
                                };
                                img.src = imgUrl;
                                resp1.find(".panel-body").html("");
                                resp1.find(".panel-body")[0].appendChild(img);
                            } else {
                                regex = new RegExp('.*?text.*', 'g');
                                if (regex.test(contentType)) {
                                    resp1.find(".panel-body").html("");
                                    var text = xhr.responseText;
                                    liresp4.html("<span class='glyphicon glyphicon-file'></span>   " + getByteCount(text));
                                    if (text.slice(0, 1) === "{" && text.indexOf("}", text.length - 1) !== -1) {
                                        resp1.find(".panel-body").addClass("jsonview");
                                        resp1.find(".panel-body").JSONView(text);
                                    } else {
                                        resp1.find(".panel-body").html(text);
                                    }
                                }
                            }
                        }
                        resptab.find("a:first").tab("show");
                        responseBodyDiv.show();
                        requestBtn.attr("disabled", false);
                        requestBtn.html(SwaggerApiUI.btnRequestDefaultValue);
                        requestBtn.css("text-align", "center");
                        clearInterval(intervalId);
                    },
                    error: function (xhr) {
                        var resptab = $('<div id="resptab" class="tabs-container"></div>');
                        var ulrespDiv = $('<div class="panel-body" style="height:31px;"></div>');
                        var ulresp1 = $('<ul class="nav nav-tabs" style="float:left;"></ul>');
                        var ulresp2 = $('<ul class="nav nav-tabs" style="float:right;"></ul>');

                        var liresp1 = $('<li id="liresp1" class="active"><a href="javascript:void(0);"> 响应内容 </a></li>');
                        var liresp2 = $('<li id="liresp2"><a href="javascript:void(0);"> Cookies </a></li>');
                        var liresp3 = $('<li id="liresp3"><a href="javascript:void(0);"> Headers </a></li>');
                        var liresp4 = $('<li id="liresp4" style="margin-right: 30px;"></li>');
                        var liresp5 = $('<li id="liresp5" style="margin-right: 50px;"><span class="glyphicon glyphicon-time" aria-hidden="true"></span>  ' + getExecuteTime(startTime, new Date()) + '</li>');

                        liresp1.click(function () {
                            $("#liresp1").addClass("active");
                            $("#liresp2").removeClass("active");
                            $("#liresp3").removeClass("active");
                            $("#tabresp").show();
                            $("#tabcookie").hide();
                            $("#tabheader").hide();
                        });
                        liresp2.click(function () {
                            $("#liresp1").removeClass("active");
                            $("#liresp2").addClass("active");
                            $("#liresp3").removeClass("active");
                            $("#tabresp").hide();
                            $("#tabcookie").show();
                            $("#tabheader").hide();
                        });
                        liresp3.click(function () {
                            $("#liresp1").removeClass("active");
                            $("#liresp2").removeClass("active");
                            $("#liresp3").addClass("active");
                            $("#tabresp").hide();
                            $("#tabcookie").hide();
                            $("#tabheader").show();
                        });

                        ulresp1.append(liresp1);
                        ulresp1.append(liresp2);
                        ulresp1.append(liresp3);
                        ulresp2.append(liresp4);
                        ulresp2.append(liresp5);
                        ulrespDiv.append(ulresp1);
                        ulrespDiv.append(ulresp2);
                        resptab.append(ulrespDiv);
                        var respcontent = $('<div class="tab-content"></div>');

                        var resp1 = $('<div id="tabresp" class="tab-pane" style="display: block;"><div class="panel-body"><pre></pre></div></div>');
                        var resp2 = $('<div id="tabcookie" class="tab-pane"><div class="panel-body">暂无</div>');
                        var resp3 = $('<div id="tabheader" class="tab-pane"><div class="panel-body">暂无</div></div>');

                        respcontent.append(resp1).append(resp2).append(resp3);
                        resptab.append(respcontent);
                        respcleanDiv.append(resptab);
                        var allheaders = xhr.getAllResponseHeaders();
                        if (allheaders != null && typeof (allheaders) != 'undefined' && allheaders != "") {
                            var headers = allheaders.split("\r\n");
                            var headertable = $('<table class="table table-hover table-bordered table-text-center"><tr><th>请求头</th><th>value</th></tr></table>');
                            for (var i = 0; i < headers.length; i++) {
                                var header = headers[i];
                                if (header != null && header != "") {
                                    var headerValu = header.split(":");
                                    var headertr = $('<tr><th class="table-active">' + headerValu[0] + '</th><td>' + headerValu[1] + '</td></tr>');
                                    headertable.append(headertr);
                                }
                            }
                            //设置Headers内容
                            resp3.find(".panel-body").html("");
                            resp3.find(".panel-body").append(headertable);
                        }
                        var contentType = xhr.getResponseHeader("Content-Type");
                        if (xhr.hasOwnProperty("responseJSON")) {
                            //如果存在该对象,服务端返回为json格式
                            resp1.find(".panel-body").html("");
                            var jsondiv = $('<div></div>');
                            var responseJSON = xhr["responseJSON"];
                            liresp4.html("<span class='glyphicon glyphicon-file'></span>   " + getByteCount(responseJSON));
                            jsondiv.JSONView(responseJSON);
                            resp1.find(".panel-body").append(jsondiv);
                        } else {
                            //判断是否是text
                            var regex = new RegExp('.*?text.*', 'g');
                            if (regex.test(contentType)) {
                                resp1.find(".panel-body").html("");
                                var text = xhr.responseText;
                                liresp4.html("<span class='glyphicon glyphicon-file'></span>   " + getByteCount(text));
                                if (text.slice(0, 1) === "{" && text.indexOf("}", text.length - 1) !== -1) {
                                    resp1.find(".panel-body").addClass("jsonview");
                                    resp1.find(".panel-body").JSONView(text);
                                } else {
                                    resp1.find(".panel-body").html(text);
                                }
                            }
                        }
                        responseBodyDiv.show();
                        requestBtn.attr("disabled", false);
                        requestBtn.html(SwaggerApiUI.btnRequestDefaultValue);
                        requestBtn.css("text-align", "center");
                        clearInterval(intervalId);
                    }
                });
            }
        })
    };

    SwaggerApiUI.getRequestDefinition = function (refType) {
        var definitionsArray = SwaggerApiUI.getDoc().data("definitionsArray");
        var deftion = null;
        for (var i = 0; i < definitionsArray.length; i++) {
            var definition = definitionsArray[i];
            if (definition.key == refType) {
                deftion = definition.value;
                break;
            }
        }
        return deftion;
    };

    SwaggerApiUI.createApiInfoTable = function (apiInfo) {
        var table = $('<table class="table table-hover table-bordered table-text-center"></table>');
        var thead = $('<thead><tr><th colspan="2" style="text-align:center">API接口文档</th></tr></thead>');
        table.append(thead);
        var tbody = $('<tbody></tbody>');

        var url = $('<tr><th class="table-active" style="text-align: right; width: 150px;">接口url</th><td style="text-align: left"><code>' + SwaggerApiUI.getStringValue(apiInfo.url) + '</code></td></tr>');
        tbody.append(url);

        var summary = $('<tr><th class="table-active" style="text-align: right;">接口名称</th><td style="text-align: left">' + SwaggerApiUI.getStringValue(apiInfo.summary) + '</td></tr>');
        tbody.append(summary);

        var description = $('<tr><th class="table-active" style="text-align: right;">接口说明</th><td style="text-align: left">' + SwaggerApiUI.getStringValue(apiInfo.description) + '</td></tr>');
        tbody.append(description);

        var methodType = $('<tr><th class="table-active" style="text-align: right;">请求方式</th><td style="text-align: left"><code>' + SwaggerApiUI.getStringValue(apiInfo.methodType) + '</code></td></tr>');
        tbody.append(methodType);

        var consumesArr = SwaggerApiUI.getValue(apiInfo, "consumes", [], true);
        var consumes = $('<tr><th class="table-active" style="text-align: right;">请求内容类型</th><td style="text-align: left"><code>' + consumesArr + '</code></td></tr>');
        tbody.append(consumes);

        var producesArr = SwaggerApiUI.getValue(apiInfo, "produces", [], true);
        var produces = $('<tr><th class="table-active" style="text-align: right;">响应内容类型</th><td style="text-align: left"><code>' + producesArr + '</code></td></tr>');
        tbody.append(produces);

        //请求参数
        var args = $('<tr><th class="table-active" style="text-align: right;">请求参数</th></tr>');
        //判断是否有请求参数
        var ptd, ptable, pbody;
        if (typeof (apiInfo.parameters) != 'undefined' && apiInfo.parameters != null) {
            ptd = $("<td></td>");
            ptable = getDetailTable();
            ptable.append($('<thead><th style="width: 15%;">参数名称</th><th style="width: 11%;">参数类型</th><th style="width: 7%;">是否必须</th><th style="width: 7%;">参数位置</th><th style="width: 25%;">参数说明</th><th style="width: 35%;">参数Model</th></thead>'));
            pbody = $('<tbody></tbody>');
            $.each(apiInfo.parameters, function (i, param) {
                //判断是否是ref,如果是，列出他的属性说明
                var refflag = false;
                //判断是否有type属性,如果有,则后端为实体类形参
                var ptype = "string";
                if (param.hasOwnProperty("type")) {
                    ptype = param["type"];
                } else {
                    ///判断是有schma
                    if (param.hasOwnProperty("schema")) {
                        var schema = param["schema"];
                        //是否有type
                        if (schema.hasOwnProperty("type")) {
                            ptype = schema["type"];
                        } else if (schema.hasOwnProperty("$ref")) {
                            //是否是ref
                            var regex = new RegExp("#/definitions/(.*)$", "ig");
                            if (regex.test(schema["$ref"])) {
                                refflag = true;
                                ptype = RegExp.$1;
                            }
                        }
                    }
                }
                var ptr = null;
                //列出属性
                if (refflag) {
                    var requestDefinition = "&nbsp;";
                    var deftion = SwaggerApiUI.getRequestDefinition(ptype);
                    if (deftion != null) {
                        requestDefinition = formatterJson(JSON.stringify(deftion));
                    }
                    var addReqModel;
                    var reqModel = $("<td rowspan='" + Object.getOwnPropertyNames(deftion).length + "' style='text-align: left; vertical-align: top; padding-top: 10px; background-color: #fff; color: #000;'></td>");
                    var div = $("<div class='jsonview'></div>");
                    div.JSONView(requestDefinition);
                    reqModel.append(div);
                    var mcs = SwaggerApiUI.getMenuConstructs();
                    for (var k in mcs.definitions) {
                        if (ptype == k) {
                            var tp = mcs.definitions[ptype];
                            var props = tp["properties"];
                            var requireds = tp["required"];
                            for (var prop in props) {
                                if (props.hasOwnProperty(prop)) {
                                    pvalue = props[prop];
                                }
                                var tr = $("<tr></tr>");
                                requireChinese = "<span style='color: darkgreen;'>&#10006</span>";
                                if ($.inArray(prop, requireds) > -1) {
                                    requireChinese = "<span style='color: red;'>&#10004</span>";
                                }
                                tr.append($("<td style='text-align: center;'>" + prop + "</td>"));
                                tr.append($("<td style='text-align: center;'>" + SwaggerApiUI.toString(pvalue.type, "string") + "</td>"));
                                tr.append($("<td style='text-align: center;'>" + requireChinese + "</td>"));
                                tr.append($("<td style='text-align: center;'>" + SwaggerApiUI.getStringValue(param['in']) + "</td>"));
                                tr.append($("<td style='text-align: center;'>" + SwaggerApiUI.toString(pvalue.description, "") + "</td>"));
                                if (!addReqModel) {
                                    tr.append(reqModel);
                                    addReqModel = true;
                                }
                                pbody.append(tr);
                            }
                        }
                    }
                } else {
                    ptr = $('<tr><td>' + param.name + '</td><td>' + ptype + '</td><td style="text-align: center;">' + SwaggerApiUI.getStringValue(param['description']) + '</td><td>' + SwaggerApiUI.getStringValue(param['in']) + '</td><td>' + param['required'] + '</td><td>&nbsp;</td></tr>');
                    pbody.append(ptr);
                }
            });
            ptable.append(pbody);
            ptd.append(ptable);
            args.append(ptd);
        } else {
            args.append($('<td  style="text-align: left">暂无</td>'));
        }
        tbody.append(args);

        //响应数据结构
        var respParams = $('<tr><th class="table-active" style="text-align: right;">响应参数</th></tr>');
        var respPart = $('<td  style="text-align: left"></td>');
        respPart.append(SwaggerApiUI.createResponseDefinitionDetail(apiInfo));
        respParams.append(respPart);
        tbody.append(respParams);

        //响应错误码及错误信息
        var respErrorCode = $('<tr><th class="table-active" style="text-align: right;">响应错误</th></tr>');
        var respErrorCodeDetail = $('<td></td>');
        SwaggerApiUI.createResponseErrorCodeDetail(apiInfo, respErrorCodeDetail);
        respErrorCode.append(respErrorCodeDetail);
        tbody.append(respErrorCode);

        //响应状态码
        var response = $('<tr><th class="table-active" style="text-align: right;">响应状态</th></tr>');
        if (typeof (apiInfo.responses) != 'undefined' && apiInfo.responses != null) {
            var resp = apiInfo.responses;
            ptd = $("<td></td>");
            ptable = getDetailTable();
            var phead = $('<thead><th style="width: 33%;">状态码</th><th style="width: 33.5%;">状态说明</th><th style="width: 33.5%;">状态返回</th></thead>');
            ptable.append(phead);
            pbody = $('<tbody></tbody>');
            var statusMap = {};
            statusMap["200"] = "OK http响应成功";
            statusMap["400"] = "Bad Request 请求出现语法错误,一般是请求参数不对";
            statusMap["401"] = "Unauthorized 访问被拒绝";
            statusMap["403"] = "Forbidden 资源不可用";
            statusMap["404"] = "Not Found 无法找到指定位置的资源";
            statusMap["500"] = "Internal Server Error 服务器内部错误,请联系开发人员!!!";
            for (var status in statusMap) {
                var rescrobj = resp[status];
                var schematd = $("<td></td>");
                //判断是否存在schma
                if (rescrobj && rescrobj.hasOwnProperty("schema")) {
                    var schema = rescrobj["schema"];
                    var regex = new RegExp("#/definitions/(.*)$", "ig");
                    if (regex.test(schema["$ref"])) {
                        var ptype = RegExp.$1;
                        schematd.append(ptype);
                    }
                }
                var tr = $("<tr></tr>");
                var statusTd = $("<td>" + status + "</td>");
                description = $("<td>" + statusMap[status] + "</td>");
                tr.append(statusTd).append(description).append(schematd);
                pbody.append(tr);
            }
            ptable.append(pbody);
            ptd.append(ptable);
            response.append(ptd);
        } else {
            response.append($("<td>暂无</td>"));
        }
        tbody.append(response);
        table.append(tbody);
        SwaggerApiUI.creatabTab();
        //查找接口doc
        SwaggerApiUI.getDoc().find("#tab1").find(".panel-body").html("");
        SwaggerApiUI.getDoc().find("#tab1").find(".panel-body").append(table);
    };

    /***
     * 响应参数详情
     * @param apiInfo
     */
    SwaggerApiUI.createResponseDefinitionDetail = function (apiInfo) {
        var resp = apiInfo.responses;
        var table = getDetailTable();
        if (resp.hasOwnProperty("200")) {
            var ok = resp["200"];
            if (ok.hasOwnProperty("schema")) {
                var schema = ok["schema"];
                var ref = schema["$ref"];
                var regex = new RegExp("#/definitions/(.*)$", "ig");
                if (regex.test(ref)) {
                    var refType = RegExp.$1;
                    var definitionsArray = SwaggerApiUI.getDoc().data("definitionsArray");
                    var mcs = SwaggerApiUI.getMenuConstructs();
                    for (var k in mcs.definitions) {
                        if (refType == k) {
                            table.append('<thead><tr><th colspan="2" style="width: 15%;">参数名称</th><th style="width: 11%;">参数类型</th><th style="width: 7%;">是否必须</th><th style="width: 32%;">参数说明</th><th style="width: 35%;">参数Model</th></tr></thead>');
                            var tp = mcs.definitions[refType];
                            var props = tp["properties"];
                            var requireds = tp["required"];

                            var addResModel;
                            var modelRowCount = Object.getOwnPropertyNames(props).length;
                            var resModel = $("<td style='text-align: left;vertical-align: top; padding-top: 10px; background-color: #fff;'></td>");
                            resModel.append(SwaggerApiUI.createResponseDefinition(apiInfo));
                            var tbody = $("<tbody></tbody>");
                            for (var prop in props) {
                                var pvalue;
                                if (props.hasOwnProperty(prop)) {
                                    pvalue = props[prop];
                                }
                                var tr = $("<tr></tr>");
                                var requireChinese = "<span style='color: darkgreen;'>&#10006</span>";
                                if ($.inArray(prop, requireds) > -1) {
                                    requireChinese = "<span style='color: red;'>&#10004</span>";
                                }
                                //只遍历一级属性
                                //判断是否是ref
                                if (pvalue.hasOwnProperty("items") && pvalue["items"].hasOwnProperty("$ref")) {
                                    var param_ref = pvalue["items"]["$ref"];
                                    var regex1 = new RegExp("#/definitions/(.*)$", "ig");
                                    if (regex1.test((param_ref))) {
                                        var ptype = RegExp.$1;
                                        tr.append($("<td colspan='2' style='text-align: center;'>" + prop + "</td>"));
                                        tr.append($("<td style='text-align: center;'>" + SwaggerApiUI.toString(pvalue.type, "string") + "</td>"));
                                        tr.append($("<td style='text-align: center;'>" + requireChinese + "</td>"));
                                        tr.append($("<td style='text-align: center;'>" + SwaggerApiUI.toString(pvalue.description, ptype) + "</td>"));
                                        if (!addResModel) {
                                            tr.append(resModel);
                                            addResModel = true;
                                        }
                                        tbody.append(tr);
                                        for (var j in mcs.definitions) {
                                            if (ptype == j) {
                                                var tpp = mcs.definitions[ptype];
                                                var pp_props = tpp["properties"];
                                                var requireds1 = tpp["required"];
                                                var prop1_count = Object.getOwnPropertyNames(pp_props).length;
                                                modelRowCount = modelRowCount + prop1_count;
                                                var prop1_index = 0;
                                                for (var prop1 in pp_props) {
                                                    prop1_index = prop1_index + 1;
                                                    var tr1 = $("<tr></tr>");
                                                    var pvalue1;
                                                    if (pp_props.hasOwnProperty(prop1)) {
                                                        pvalue1 = pp_props[prop1];
                                                    }
                                                    requireChinese = "<span style='color: darkgreen;'>&#10006</span>";
                                                    if ($.inArray(prop1, requireds1) > -1) {
                                                        requireChinese = "<span style='color: red;'>&#10004</span>";
                                                    }
                                                    tr1.append($("<td style='text-align: center; width: 80px; padding: 0;'>&#10148</td>"));
                                                    tr1.append($("<td style='text-align: center;'>" + prop1 + "</td>"));
                                                    tr1.append($("<td style='text-align: center;'>" + SwaggerApiUI.getValue(pvalue1, "type", "string", true) + "</td>"));
                                                    tr1.append($("<td style='text-align: center;'>" + requireChinese + "</td>"));
                                                    tr1.append($("<td style='text-align: center;'>" + SwaggerApiUI.getValue(pvalue1, "description", "", true) + "</td>"));
                                                    tbody.append(tr1);
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    tr.append($("<td colspan='2' style='text-align: center;'>" + prop + "</td>"));
                                    tr.append($("<td style='text-align: center;'>" + SwaggerApiUI.toString(pvalue.type, "string") + "</td>"));
                                    tr.append($("<td style='text-align: center;'>" + requireChinese + "</td>"));
                                    tr.append($("<td style='text-align: center;'>" + SwaggerApiUI.toString(pvalue.description, "") + "</td>"));
                                    if (!addResModel) {
                                        tr.append(resModel);
                                        addResModel = true;
                                    }
                                    tbody.append(tr);
                                }
                            }
                            resModel.attr("rowspan", modelRowCount);
                            table.append(tbody);
                        }
                    }
                }
            }
        }
        return table;
    };


    SwaggerApiUI.createResponseDefinition = function (apiInfo) {
        var resp = apiInfo.responses;
        var div = $("<div class='jsonview'>暂无</div>");
        if (resp.hasOwnProperty("200")) {
            var ok = resp["200"];
            if (ok.hasOwnProperty("schema")) {
                var schema = ok["schema"];
                var ref = schema["$ref"];
                var regex = new RegExp("#/definitions/(.*)$", "ig");
                var refType, flag, htmlValue, definitionsArray, definition;
                if (regex.test(ref)) {
                    refType = RegExp.$1;
                    flag = false;
                    htmlValue = refType;
                    definitionsArray = SwaggerApiUI.getDoc().data("definitionsArray");
                    for (var i = 0; i < definitionsArray.length; i++) {
                        definition = definitionsArray[i];
                        if (definition.key == refType) {
                            flag = true;
                            htmlValue = definition.value;
                            break;
                        }
                    }
                    div.html("");
                    if (flag) {
                        div.JSONView(htmlValue);
                    } else {
                        div.html(refType);
                    }
                } else {
                    //未发现ref属性
                    if (schema.hasOwnProperty("type")) {
                        div.html("");
                        var type = schema["type"];
                        if (type == "array") {
                            var items = schema["items"];
                            ref = items["$ref"];
                            regex = new RegExp("#/definitions/(.*)$", "ig");
                            if (regex.test(ref)) {
                                refType = RegExp.$1;
                                flag = false;
                                htmlValue = refType;
                                definitionsArray = SwaggerApiUI.getDoc().data("definitionsArray");
                                for (var j = 0; j < definitionsArray.length; j++) {
                                    definition = definitionsArray[j];
                                    if (definition.key == refType) {
                                        flag = true;
                                        htmlValue = definition.value;
                                        break;
                                    }
                                }
                                div.html("");
                                if (flag) {
                                    var obj = [];
                                    obj.push(htmlValue);
                                    div.JSONView(obj);
                                } else {
                                    div.html(refType);
                                }
                            }
                        } else {
                            div.html(type);
                        }
                    }
                }
            }
        }
        return div;
    };

    SwaggerApiUI.definitions = function (menu) {
        var definitionsArray = [];
        if (menu != null && typeof (menu) != "undefined" && menu.hasOwnProperty("definitions")) {
            var definitions = menu["definitions"];
            for (var definition in definitions) {
                var defiType = new definitionType();
                defiType.key = definition;
                //获取value
                var value;
                if (definitions.hasOwnProperty(definition)) {
                    value = definitions[definition];
                }
                if (checkUndefined(value)) {
                    //是否有properties
                    if (value.hasOwnProperty("properties")) {
                        var properties = value["properties"];
                        var defiTypeValue = {};
                        for (var property in properties) {
                            var propobj;
                            if (properties.hasOwnProperty(property)) {
                                propobj = properties[property];
                            }
                            //默认string类型
                            var propValue = "";
                            //判断是否有类型
                            var ref, regex, refType;
                            if (propobj.hasOwnProperty("type")) {
                                var type = propobj["type"];
                                //判断是否有example
                                if (propobj.hasOwnProperty("example")) {
                                    propValue = propobj["example"];
                                } else if (checkIsBasicType(type)) {
                                    propValue = getBasicTypeValue(type);
                                } else {
                                    if (type == "array") {
                                        propValue = [];
                                        var items = propobj["items"];
                                        ref = items["$ref"];
                                        regex = new RegExp("#/definitions/(.*)$", "ig");
                                        if (regex.test(ref)) {
                                            refType = RegExp.$1;
                                            //这里需要递归判断是否是本身,如果是,则退出递归查找
                                            if (refType != definition) {
                                                propValue.push(findRefDefinition(refType, definitions));
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (propobj.hasOwnProperty("$ref")) {
                                    ref = propobj["$ref"];
                                    regex = new RegExp("#/definitions/(.*)$", "ig");
                                    if (regex.test(ref)) {
                                        refType = RegExp.$1;
                                        //这里需要递归判断是否是本身,如果是,则退出递归查找
                                        if (refType != definition) {
                                            propValue = findRefDefinition(refType, definitions);
                                        } else {
                                            propValue = {};
                                        }
                                    }
                                } else {
                                    propValue = {};
                                }
                            }
                            defiTypeValue[property] = propValue;
                        }
                        defiType.value = defiTypeValue;
                    } else {
                        defiType.value = {};
                    }
                }
                definitionsArray.push(defiType);
            }
        }
        SwaggerApiUI.getDoc().data("definitionsArray", definitionsArray);
    };

    SwaggerApiUI.getDefinitions = function () {
        return SwaggerApiUI.getDoc().data("definitionsArray");
    };

    /***
     * 响应错误详情
     * @param apiInfo
     */
    SwaggerApiUI.createResponseErrorCodeDetail = function (apiInfo, respErrorCodeDetail) {
        var loadDiv = $('<div style="font-weight:bold;letter-spacing:3px;color:#127386;padding:10px;text-align:left;">正在获取中.</div>');
        respErrorCodeDetail.html(loadDiv);
        var times = 1;
        var intervalId = setInterval(function () {
            loadDiv.html("正在获取中" + getPoint(times++));
        }, 1000);
        $.ajax({
            url: "errorCode/getErrorCodeInfoByInterfaceNo",
            type: "get",
            async: true,
            data: {
                url: SwaggerApiUI.getStringValue(apiInfo.url)
            },
            success: function (result) {
                if (typeof result == "string") {
                    result = $.parseJSON(result);
                }
                var v_status = result.status;
                if (v_status.indexOf('ok') > -1) {
                    var map = result.data;
                    if (Object.getOwnPropertyNames(map).length == 0) {
                        loadDiv.html("暂无");
                        loadDiv.css("color", "#e83e8c");
                    } else {
                        var detailTable = getDetailTable();
                        var detailhead = $('<thead><th style="width: 33%;">错误码</th><th style="width: 67%;">错误信息</th></thead>');
                        detailTable.append(detailhead);
                        var detailbody = $('<tbody></tbody>');
                        for (var errorCode in map) {
                            var tr = $("<tr></tr>");
                            tr.append($("<td>" + errorCode + "</td>")).append($("<td>" + map[errorCode] + "</td>"));
                            detailbody.append(tr);
                        }
                        detailTable.append(detailbody);
                        respErrorCodeDetail.html(detailTable);
                    }
                } else {
                    loadDiv.html("查询异常: " + result.msg);
                    loadDiv.css("color", "#e83e8c");
                    loadDiv.css("letter-spacing", "1px");
                    loadDiv.css("text-align", "center");
                }
                clearInterval(intervalId);
            }
        });
    };

    /**
     * 获取默认请求参数类型
     */
    SwaggerApiUI.getDefaultRequiredType = function (obj) {
        var t = "string";
        if (typeof (obj) != 'undefined' && obj != null) {
            t = obj.toString();
        }
        return t;
    };

    SwaggerApiUI.getDoc = function () {
        return $("#content");
    };
    SwaggerApiUI.getMenu = function () {
        return $("#menu");
    };

    SwaggerApiUI.init();

    function getDetailTable() {
        return $('<table class="table table-bordered table-hover table-striped" style="table-layout: fixed;"></table>');
    }

    function checkIsBasicType(type) {
        var basicTypes = ["string", "integer", "number", "object", "boolean"];
        var flag = false;
        if ($.inArray(type, basicTypes) > -1) {
            flag = true;
        }
        return flag;
    }

    function getBasicTypeValue(type) {
        var propValue = "";
        //是否是基本类型
        if (type == "integer") {
            propValue = 0;
        }
        if (type == "boolean") {
            propValue = true;
        }
        if (type == "object") {
            propValue = {};
        }
        if (type == "number") {
            propValue = parseFloat(0);
        }
        return propValue;
    }

    function findRefDefinition(definitionName, definitions) {
        var defaultValue = "";
        for (var definition in definitions) {
            if (definitionName == definition) {
                var value;
                if (definitions.hasOwnProperty(definition)) {
                    value = definitions[definition];
                }
                //是否有properties
                if (value.hasOwnProperty("properties")) {
                    var properties = value["properties"];
                    var defiTypeValue = {};
                    for (var property in properties) {
                        var propobj;
                        if (properties.hasOwnProperty(property)) {
                            propobj = properties[property];
                        }
                        //默认string类型
                        var propValue = "";
                        //判断是否有类型
                        if (propobj.hasOwnProperty("type")) {
                            var type = propobj["type"];
                            //判断是否有example
                            if (propobj.hasOwnProperty("example")) {
                                propValue = propobj["example"];
                            } else if (checkIsBasicType(type)) {
                                propValue = getBasicTypeValue(type);
                            } else {
                                if (type == "array") {
                                    propValue = [];
                                    var items = propobj["items"];
                                    var ref = items["$ref"];
                                    var regex = new RegExp("#/definitions/(.*)$", "ig");
                                    if (regex.test(ref)) {
                                        var refType = RegExp.$1;
                                        if (refType != definitionName) {
                                            propValue.push(findRefDefinition(refType, definitions));
                                        }
                                    }
                                }
                            }
                        }
                        defiTypeValue[property] = propValue;
                    }
                    defaultValue = defiTypeValue;
                } else {
                    defaultValue = {};
                }
            }
        }
        return defaultValue;
    }

    function initial(str) {
        return str.toLowerCase().replace(/\b\w+\b/g, function (word) {
            return word.substring(0, 1).toUpperCase() + word.substring(1);
        });
    }

    function checkUndefined(obj) {
        var flag = false;
        if (obj != null && typeof (obj) != "undefined") {
            flag = true;
        }
        return flag;
    }

    function definitionType() {
        this.key = "";
        this.value = {};
    }

    /**
     * 标签组信息
     */
    function TagInfo(name, description) {
        this.name = name;
        this.description = description;
        this.childrens = [];
    }

    /**
     * api实体信息
     */
    function ApiInfo(options) {
        //判断options
        this.tag = [];
        this.url = "";
        this.description = "";
        this.operationId = "";
        this.parameters = [];
        this.produces = [];
        this.responses = {};
        this.methodType = "post";
        this.consumes = [];
        this.summary = "";
        if (options != null && typeof (options) != 'undefined') {
            this.tag = options.tags;
            this.description = options.description;
            this.operationId = options.operationId;
            this.summary = options.summary;
            this.parameters = options.parameters;
            this.produces = options.produces;
            this.responses = options.responses;
            this.consumes = options.consumes;
        }
    }

    function getPoint(times) {
        var str = ".";
        for (var i = 0; i < times % 6; i++) {
            str += ".";
        }
        return str;
    }

    function getByteCount(str) {
        if (!(typeof(str) == "string")) {
            str = JSON.stringify(str);
        }
        var count = str.replace(/[\u0391-\uFFE5]/g, "**").length;
        if (count >= 1024) {
            return (count / 1024).toFixed(2) + "KB";
        }
        return count + "B";
    }

    function getExecuteTime(startTime, finishTime) {
        var executeTime = new Date().getTime() - startTime;
        if (executeTime > 1000) {
            return (executeTime / 1000).toFixed(2) + "s";
        }
        return executeTime + "ms";
    }
})(jQuery);