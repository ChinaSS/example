<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/globals/taglibs.jsp"%>
<html lang="zh">
	<head>
		<%@include file="/globals/meta.jsp"%>
        <title>文艺机构信息资源发布应用系统</title>

		<link rel="stylesheet" href="${ctx }/static/modules/bootstrap/css/bootstrap.min.css" />
		<link rel="stylesheet" href="${ctx }/static/modules/Font-Awesome/css/font-awesome.min.css" />
		<link rel="stylesheet" href="${ctx }/static/modules/ace/css/ace-fonts.css" />
		<link rel="stylesheet" href="${ctx }/static/modules/ace/css/ace.css" />
        <!--[if lte IE 9]>
        <link rel="stylesheet" href="modules/ace/css/ace-part2.min.css"/>
        <link rel="stylesheet" href="modules/ace/css/ace-ie.min.css"/>
        <![endif]-->
        <link rel="stylesheet" href="${ctx }/static/core/home/home.css" />
        <link rel="stylesheet" href="${ctx }/static/app/app.css" />

        <!-- IE8响应式布局 兼容性js文件 -->
        <!--[if lte IE 8]>
        <script src="modules/ace/js/html5shiv.js"></script>
        <script src="modules/ace/js/respond.min.js"></script>
        <![endif]-->
	</head>

	<body class="no-skin"  ng-controller="BodyCtrl">
        <div class="ajax-progress" id="ajaxProgress"></div>
        <div class="ajax-progress-backdrop" id="ajaxProgressMode"></div>
        <!-- header -->
		<div id="navbar" class="navbar   navbar-default navbar-fixed-top">
			<div class="navbar-container" id="navbar-container">
				<button type="button" class="navbar-toggle menu-toggler pull-left" id="menu-toggler">
					<span class="sr-only">Toggle sidebar</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<div class="navbar-header pull-left">
					<a href="#" class="navbar-brand">
						<small>
                            文艺机构信息资源发布应用系统
						</small>
					</a>
				</div>

				<div class="navbar-buttons navbar-header pull-right" role="navigation">
					<ul class="nav ace-nav">

                        <li class="purple">
                            <a data-toggle="dropdown" class="dropdown-toggle" href="#">
                                <i class="ace-icon fa fa-bell icon-animated-bell"></i>
                                <span class="badge badge-important">8</span>
                            </a>
                            <!-- it should be a "DIV.dropdown-menu" here not a "UL.dropdown-menu" -->
                            <div class="dropdown-navbar dropdown-menu dropdown-100 dropdown-menu-right dropdown-caret dropdown-close">
                                <div class="tabbable">
                                    <!-- tab buttons here -->
                                    <ul class="nav nav-tabs">
                                        <li class="active">
                                            <a data-toggle="tab" href="#navbar-tasks">
                                                待办
                                                <span class="badge badge-danger">4</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a data-toggle="tab" href="#navbar-messages">
                                                消息
                                                <span class="badge badge-danger">5</span>
                                            </a>
                                        </li>
                                    </ul><!-- .nav-tabs -->
                                    <!-- tab content here -->
                                    <div class="tab-content">
                                        <div id="navbar-tasks" class="tab-pane in active">
                                            <!-- first tab pane and the .dropdown-menu inside it -->
                                            <ul class="dropdown-navbar dropdown-menu dropdown-menu-right">
                                                <!-- .dropdown-content -->
                                                <li class="dropdown-content">
                                                    <ul class="dropdown-menu dropdown-navbar">
                                                        <li>
                                                            <a href="#">
                                                                <span class="msg-body">
                                                                    <span class="msg-title">
                                                                        <span class="blue">发文:</span>
                                                                        关于协同办公平台上线的通知请您尽快办理 。
                                                                    </span>

                                                                    <span class="msg-time">
                                                                        <i class="ace-icon fa"></i>
                                                                        <span>2014年07月17日 星期四 15:33</span>
                                                                    </span>
                                                                </span>
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="#">
                                                                <span class="msg-body">
                                                                    <span class="msg-title">
                                                                        <span class="blue">出差申请:</span>
                                                                        张三提交的出差申请请您尽快处理 。
                                                                    </span>

                                                                    <span class="msg-time">
                                                                        <i class="ace-icon fa "></i>
                                                                        <span>2014年07月16日 星期三 15:33</span>
                                                                    </span>
                                                                </span>
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="#">
                                                                <span class="msg-body">
                                                                    <span class="msg-title">
                                                                        <span class="blue">借款申请:</span>
                                                                        王五提交的借款申请请您尽快处理 。
                                                                    </span>

                                                                    <span class="msg-time">
                                                                        <i class="ace-icon fa "></i>
                                                                        <span>2014年07月15日 星期二 15:33</span>
                                                                    </span>
                                                                </span>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </li><!-- /.dropdown-content -->

                                                <li class="dropdown-footer">
                                                    <a href="#">
                                                        所有待办
                                                        <i class="ace-icon fa fa-arrow-right"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div><!-- /.tab-pane -->


                                        <div id="navbar-messages" class="tab-pane">
                                            <!-- second tab pane and the .dropdown-menu inside it -->
                                            <ul class="dropdown-navbar dropdown-menu dropdown-menu-right">
                                                <!-- .dropdown-content -->
                                                <li class="dropdown-content">
                                                    <ul class="dropdown-menu dropdown-navbar">
                                                        <li>
                                                            <a href="#"> 您提交的出差申请成功结束！</a>
                                                        </li>
                                                        <li>
                                                            <a href="#"> 您提交的借款申请审批流程成功结束！</a>
                                                        </li>
                                                        <li>
                                                            <a href="#"> 管理员提交了合同变更,请您尽快处理.</a>
                                                        </li>
                                                        <li>
                                                            <a href="#"> 管理员提交了制式合同审批,请您尽快处理.</a>
                                                        </li>
                                                        <li>
                                                            <a href="#"> 培训申请[部门负责人审核].</a>
                                                        </li>
                                                    </ul>
                                                </li><!-- /.dropdown-content -->

                                                <li class="dropdown-footer">
                                                    <a href="#">
                                                        所有消息
                                                        <i class="ace-icon fa fa-arrow-right"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div><!-- /.tab-pane -->

                                    </div><!-- /.tab-content -->

                                </div><!-- /.tabbable -->

                            </div><!-- /DIV.dropdown-menu -->
                        </li>


						<li class="green">

							<a data-toggle="dropdown" class="dropdown-toggle" href="#">
								<i class="ace-icon fa fa-envelope icon-animated-vertical"></i>
								<span class="badge badge-success">2</span>
							</a>

							<ul class="dropdown-menu-right dropdown-navbar dropdown-menu dropdown-caret dropdown-close">
								<li class="dropdown-header">
									<i class="ace-icon fa fa-envelope-o"></i>
									2 封未读
								</li>

								<li class="dropdown-content">
									<ul class="dropdown-menu dropdown-navbar">
										<li>
											<a href="#">
												<img src="core/home/images/user.jpg" class="msg-photo" alt="Alex's Avatar" />
												<span class="msg-body">
													<span class="msg-title">
														<span class="blue">刘晔:</span>
														关于个人休假的通知
													</span>

													<span class="msg-time">
														<i class="ace-icon fa fa-clock-o"></i>
														<span>2014年07月17日 星期四 15:33</span>
													</span>
												</span>
											</a>
										</li>
                                        <li>
                                            <a href="#">
                                                <img src="core/home/images/user.jpg" class="msg-photo" alt="Alex's Avatar" />
												<span class="msg-body">
													<span class="msg-title">
														<span class="blue">李薇:</span>
														请尽快报销5-6月的费用......
													</span>

													<span class="msg-time">
														<i class="ace-icon fa fa-clock-o"></i>
														<span>2014年07月09日 星期三 14:29</span>
													</span>
												</span>
                                            </a>
                                        </li>
									</ul>
								</li>

								<li class="dropdown-footer">
									<a href="inbox.html">
										所有邮件
										<i class="ace-icon fa fa-arrow-right"></i>
									</a>
								</li>
							</ul>
						</li>

						<!-- #section:basics/navbar.user_menu -->
						<li class="light-blue">
							<a data-toggle="dropdown" href="#" class="dropdown-toggle">
								管理员
								<i class="ace-icon fa fa-caret-down"></i>
							</a>

							<ul class="user-menu dropdown-menu-right dropdown-menu dropdown-yellow dropdown-caret dropdown-closer">
								<li>
									<a href="#">
										<i class="ace-icon fa fa-cog"></i>
										修改密码
									</a>
								</li>

								<li class="divider"></li>

								<li>
									<a href="${ctx }/logout">
										<i class="ace-icon fa fa-power-off"></i>
										退出
									</a>
								</li>
							</ul>
						</li>

						<!-- /section:basics/navbar.user_menu -->
					</ul>
				</div>

			</div>
		</div>
        <!-- header end -->

        <!-- main -->
        <div class="main-container" id="main-container">
            <!-- left sidebar -->
            <div id="sidebar" class="sidebar responsive sidebar-fixed" ng-cloak>
                <!-- sidebar button -->
                <div class="sidebar-shortcuts" id="sidebar-shortcuts">
                    <div class="sidebar-shortcuts-large" id="sidebar-shortcuts-large">
                        <button class="btn btn-success">
                            <i class="ace-icon fa fa-signal"></i>
                        </button>
                        <button class="btn btn-info">
                            <i class="ace-icon fa fa-pencil"></i>
                        </button>
                        <button class="btn btn-warning">
                            <i class="ace-icon fa fa-users"></i>
                        </button>
                        <button class="btn btn-danger">
                            <i class="ace-icon fa fa-cogs"></i>
                        </button>
                    </div>
                    <!-- mini button -->
                    <div class="sidebar-shortcuts-mini" id="sidebar-shortcuts-mini">
                        <span class="btn btn-success"></span>

                        <span class="btn btn-info"></span>

                        <span class="btn btn-warning"></span>

                        <span class="btn btn-danger"></span>
                    </div>
                </div>
                <!-- sidebar button end -->

                <!-- sidebar menu -->
                <ul sidebar-menu class="nav nav-list"></ul>
                <!-- menu toggle -->
                <div class="sidebar-toggle sidebar-collapse" id="sidebar-collapse">
                    <i class="ace-icon fa fa-angle-double-left" data-icon1="ace-icon fa fa-angle-double-left" data-icon2="ace-icon fa fa-angle-double-right"></i>
                </div>
                <!-- sidebar menu end -->
            </div>
            <!-- left sidebar end -->

            <!-- main content -->
            <div class="main-content">
                <!-- page location -->
                <div class="breadcrumbs breadcrumbs-fixed" id="breadcrumbs">
                    <ul class="breadcrumb">
                        <li>
                            <i class="ace-icon fa fa-home home-icon"></i>
                            <a href="index.html">首页</a>
                        </li>
                    </ul>
                    <div class="nav-search" id="nav-search">
                        <form class="form-search">
							<span class="input-icon">
								<input type="text" placeholder="查询..." class="nav-search-input" id="nav-search-input" autocomplete="off" />
								<i class="ace-icon fa fa-search nav-search-icon"></i>
							</span>
                        </form>
                    </div>
                </div>
                <!-- page location end -->

                <!-- page content -->
                <div class="page-content" >
                    <div class="row">
                        <div class="col-xs-12" ng-view>
                            <!-- Angular View -->


                            <!-- Angular View End -->
                        </div>
                    </div>
                </div>
                <!-- page content -->
            </div>
            <!-- main content end -->

            <!-- footer -->
            <div class="footer">
                <div class="footer-inner">
                    <div class="footer-content">
						<span style="">
							Copyright XXX All Rights Reserved
						</span>
                    </div>
                </div>
                <!-- scroll up -->
                <a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse">
                    <i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i>
                </a>
            </div>
            <!-- footer end -->
        </div>

        <!-- requireJS Load -->
        <script src="${ctx }/static/modules/requirejs/require.js" type="text/javascript"></script>
		<script type="text/javascript">
            require.config({paths:{"jquery":"modules/jquery/jquery1x.min"}});
		</script>
		<!--[if !IE]>
        <script type="text/javascript">
            require.config({paths:{"jquery":"modules/jquery/jquery.min"}});
        </script>
        <![endif]-->
		<script type="text/javascript">
			//全局ContextPath
			function getServer() {
				var contextPath = '<%=request.getContextPath() %>';
			    return contextPath;
			}
		</script>
        <!-- Page Load Entrance -->
        <script src="${ctx }/static/main.js"></script>
	</body>
</html>
