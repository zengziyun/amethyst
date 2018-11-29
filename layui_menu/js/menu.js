//注意：导航 依赖 element 模块，否则无法进行功能性操作
		//初始化导航条
		layui.use('element', function() {
			var $ = layui.jquery;
			var element = layui.element;
			var active = {
				tabAdd : function(url,id,name) {
					element.tabAdd("tab",{
						title:name,
						content:'<iframe data-frameid="'+id+'" scrolling="auto" frameborder="0" src="test.html" style="width:100%;height:99%;"></iframe>',
						id:id
					});
					CustomRightClick(id); //给tab绑定右击事件
                    FrameWH();  //计算ifram层的大小
				},
				tabChange : function(id) {
					element.tabChange("tab",id);
				},
				tabDelete : function(id) {
					element.tabDelete("tab",id);
				},
				tableDeleteAll : function(ids) {
					$.each(ids, function(i,item) {
						 element.tabDelete("tab", item);
					});
				}
			};
			
			$(".site-active").on('click',function() {
				var dataid = $(this);
				//这时会判断右侧.layui-tab-title属性下的有lay-id属性的li的数目，即已经打开的tab项数目
                if ($(".layui-tab-title li[lay-id]").length <= 0) {
                    //如果比零小，则直接打开新的tab项
                    active.tabAdd(dataid.attr("data-url"), dataid.attr("data-id"),dataid.attr("data-title"));
                } else {
                    //否则判断该tab项是否以及存在

                    var isData = false; //初始化一个标志，为false说明未打开该tab项 为true则说明已有
                    $.each($(".layui-tab-title li[lay-id]"), function () {
                        //如果点击左侧菜单栏所传入的id 在右侧tab项中的lay-id属性可以找到，则说明该tab项已经打开
                        if ($(this).attr("lay-id") == dataid.attr("data-id")) {
                            isData = true;
                        }
                    })
                    if (isData == false) {
                        //标志为false 新增一个tab项
                        active.tabAdd(dataid.attr("data-url"), dataid.attr("data-id"),dataid.attr("data-title"));
                    }
                }
                //最后不管是否新增tab，最后都转到要打开的选项页面上
                active.tabChange(dataid.attr("data-id"));
			});
			
			
			function CustomRightClick(id) {
                //取消右键  rightmenu属性开始是隐藏的 ，当右击的时候显示，左击的时候隐藏
                $('.layui-tab-title li').on('contextmenu', function () { return false; })
                $('.layui-tab-title,.layui-tab-title li').click(function () {
                    $('.rightmenu').hide();
                });
                //桌面点击右击 
                $('.layui-tab-title li').on('contextmenu', function (e) {
                    var popupmenu = $(".rightmenu");
                    popupmenu.find("li").attr("data-id",id); //在右键菜单中的标签绑定id属性

                    //判断右侧菜单的位置 
                    l = ($(document).width() - e.clientX) < popupmenu.width() ? (e.clientX - popupmenu.width()) : e.clientX;
                    t = ($(document).height() - e.clientY) < popupmenu.height() ? (e.clientY - popupmenu.height()) : e.clientY;
                    popupmenu.css({ left: l, top: t }).show(); //进行绝对定位
                    //alert("右键菜单")
                    return false;
                });
            }
			
			$(".rightmenu li").click(function () {
                //右键菜单中的选项被点击之后，判断type的类型，决定关闭所有还是关闭当前。
                if ($(this).attr("data-type") == "closethis") {
                    //如果关闭当前，即根据显示右键菜单时所绑定的id，执行tabDelete
                    active.tabDelete($(this).attr("data-id"))
                } else if ($(this).attr("data-type") == "closeall") {
                    var tabtitle = $(".layui-tab-title li");
                    var ids = new Array();
                    $.each(tabtitle, function (i) {
                        ids[i] = $(this).attr("lay-id");
                    })
                    //如果关闭所有 ，即将所有的lay-id放进数组，执行tabDeleteAll
                    active.tabDeleteAll(ids);
                }

                $('.rightmenu').hide(); //最后再隐藏右键菜单
            })
            function FrameWH() {
                var h = $(window).height() -41- 10 - 60 -10-44 -10;
                $("iframe").css("height",h+"px");
            }

            $(window).resize(function () {
                FrameWH();
            })
			//…
		});