define(["jquery.min"],function (jQuery) {
    //var jQuery = require('jquery');

    /**
     * $.alert 消息提示弹出
     * @param $
     */
    (function ($) {
        "use strict";

        function _create() {
            var random = String.prototype.replace.call(Math.random(), /\D/, ''),
                backdropId = 'alertBackdrop' + random,
                alertId = 'alertModal' + random,
                html = '<div class="alert-backdrop modal-backdrop fade hide" id="' + backdropId + '"></div>'
                    + '<div class="alert modal fade" id="' + alertId + '"></div>';
            $('body').append(html);

            $.data(document, 'alert-in-engineer', {
                backdrop: $('#' + backdropId),
                alertBody: $('#' + alertId)
            });

            $(document)
                .on('click.close-alert-modal', '.alert.modal .close', function () {
                    _close();
                });
        }

        function _show(title, message, data) {
            var html = '<button type="button" class="close">&times;</button>';
            if (message) {
                html += '<h4>' + title + '</h4><blockquote><p>' + message + '</p></blockquote>';
            } else {
                html += '<h3 class="text-center">' + title + '</h3>';
            }

            data.backdrop.addClass('in');
            data.alertBody.addClass('in').html(html);
        }

        function _close() {
            var data = $.data(document, 'alert-in-engineer');
            if (data) {
                data.alertBody.removeClass('in').empty();
                data.backdrop.removeClass('in');
            }
        }

        function _alert(title, message, delay) {
            var d = $.Deferred(),
                data = $.data(document, 'alert-in-engineer');

            if ($.isNumeric(message)) {
                delay = message;
                message = null;
            }
            if (!data) {
                _create();
                data = $.data(document, 'alert-in-engineer');
            }
            _show(title, message, data);
            if (delay) {
                setTimeout(function () {
                    d.resolve(_close);
                }, delay);
            } else {
                d.resolve(_close);
            }

            return d.promise();
        };

        $.alert = function (title, message, delay) {
            if (title === 'close') {
                _close();
                return this;
            } else {
                return $.when(_alert(title, message, delay));
            }

        };
    })(jQuery);

    /**
     * $.confirm 操作确认弹出
     * @param $
     */
    (function ($) {
        "use strict";

        function _create(sureText, cancelText, defer) {
            var data = $.data(document, 'confirm-in-engineer'),
                random, backdropId, confirmId, confirmModal, confirmFooter, html;

            if (!data) {
                random = String.prototype.replace.call(Math.random(), /\D/, ''),
                    backdropId = 'confirmBackdrop' + random,
                    confirmId = 'confirmModal' + random,
                    html = [
                            '<div class="confirm-backdrop modal-backdrop fade hide" id="' + backdropId + '"></div>',
                            '<div class="confirm modal fade" id="' + confirmId + '">',
                        '	<div class="modal-body"></div>',
                        '	<div class="modal-footer"></div>',
                        '</div>'
                    ];
                $('body').append(html.join(''));
                confirmModal = $('#' + confirmId);
                confirmFooter = confirmModal.find('.modal-footer');
            } else {
                confirmModal = data.confirmModal;
                confirmFooter = data.confirmFooter;
            }

            confirmFooter
                .html('<input type="button" class="btn confirm-cancel" value="' + cancelText + '" />' +
                    '<input type="button" class="btn btn-primary confirm-sure" value="' + sureText + '" />')
                .one('click.confirm-cancel', '.confirm-cancel', function () {
                    _close(defer, false);
                })
                .one('click.confirm-sure', '.confirm-sure', function () {
                    _close(defer, true);
                });

            return data || $.data(document, 'confirm-in-engineer', {
                backdrop: $('#' + backdropId),
                confirmModal: confirmModal,
                confirmBody: confirmModal.find('.modal-body'),
                confirmFooter: confirmModal.find('.modal-footer')
            });
        }

        function _show(message, data) {
            data.backdrop.addClass('in');
            data.confirmModal.addClass('in');
            data.confirmBody.html(message || '');
        }

        function _close(defer, isSure) {
            var data = $.data(document, 'confirm-in-engineer');
            if (data) {
                data.confirmModal.removeClass('in');
                data.backdrop.removeClass('in');
                data.confirmBody.empty();
                if (isSure) {
                    defer.resolve();
                } else {
                    defer.reject();
                }
            }
        }

        function _confirm(message, sureText, cancelText) {
            var d = $.Deferred(),
                data;

            sureText = sureText || '确定';
            cancelText = cancelText || '取消';
            data = _create(sureText, cancelText, d);

            _show(message, data);

            return d.promise();
        };

        $.confirm = function (message, sureText, cancelText) {
            return $.when(_confirm(message, sureText, cancelText));
        };
    })(jQuery);

    /**
     * $.prompt 操作确认弹出
     * @param $
     */
    (function ($) {
        "use strict";

        function _create(defer) {
            var data = $.data(document, 'prompt-in-engineer'),
                random, backdropId, promptId, promptModal, promptHeader, promptText, html;

            if (!data) {
                random = String.prototype.replace.call(Math.random(), /\D/, ''),
                    backdropId = 'promptBackdrop' + random,
                    promptId = 'promptModal' + random,
                    html = [
                            '<div class="prompt-backdrop modal-backdrop fade hide" id="' + backdropId + '"></div>',
                            '<div class="prompt modal fade" id="' + promptId + '">',
                        '	<div class="modal-header">',
                        '		<h3></h3>',
                        '	</div>',
                        '	<div class="modal-body">',
                        '		<input type="text" class="span6" />',
                        '	</div>',
                        '	<div class="modal-footer">',
                        '		<input type="button" class="btn prompt-cancel" value="取消" />',
                        '		<input type="button" class="btn btn-primary prompt-sure" value="确定" />',
                        '	</div>',
                        '</div>'
                    ];
                $('body').append(html.join(''));
                promptModal = $('#' + promptId);
                promptHeader = promptModal.find('h3');
                promptText = promptModal.find('input[type="text"]');
            } else {
                promptModal = data.promptModal;
                promptText = data.promptText;
            }

            promptText.on('keyup.prompt-sure-key', function (evt) {
                if (evt.keyCode === 13) {
                    _close(defer, true);
                }
            });

            promptModal
                .on('click.prompt-cancel', '.prompt-cancel', function () {
                    _close(defer, false);
                })
                .on('click.prompt-sure', '.prompt-sure', function () {
                    _close(defer, true);
                });

            return data || $.data(document, 'prompt-in-engineer', {
                backdrop: $('#' + backdropId),
                promptModal: promptModal,
                promptHeader: promptHeader,
                promptText: promptText
            });
        }

        function _show(title, data) {
            data.backdrop.addClass('in');
            data.promptModal.addClass('in');
            data.promptHeader.html(title || '');
            data.promptText[0].focus();
        }

        function _close(defer, isSure) {
            var data = $.data(document, 'prompt-in-engineer');
            if (data) {
                _off(data);
                if (isSure) {
                    defer.resolve(data.promptText.val());
                } else {
                    defer.reject(null);
                }

                data.promptModal.removeClass('in');
                data.backdrop.removeClass('in');
                data.promptHeader.empty();
                data.promptText.val('');

            }
        }

        function _off(data) {
            data.promptText.off('keyup.prompt-sure-key');
            data.promptModal
                .off('click.prompt-cancel', '.prompt-cancel')
                .off('click.prompt-sure', '.prompt-sure');
        }

        function _prompt(title) {
            var d = $.Deferred();
            title = title || '请输入';
            _show(title, _create(d));
            return d.promise();
        };

        $.prompt = function (title) {
            return $.when(_prompt(title));
        };
    })(jQuery);

    var Progress = null,
        progress = function () {
            return {
                object: $('#ajaxProgress'),
                drop: $('#ajaxProgressMode'),
                timeout: null,
                width: 0,
                start: function () {
                    this.width = 0;
                    this.drop.css('display','block');
                    this.run();
                },
                stop: function () {
                    var that = this;
                    if (this.width >= 100) {
                        window.setTimeout(function () {
                            that.width = 0;
                            that.object.css('width','0');
                            window.clearTimeout(that.timeout);
                            that.drop.css('display', 'none');
                        }, 200);
                    } else {
                        this.timeout = window.setTimeout(function () {
                            that.width = 100;
                            that.object.css('width','100%');
                            that.stop();
                        }, 50);
                    }
                },
                run: function () {
                    var that = this;
                    this.width += 3;
                    this.object.css('width', this.width + '%');
                    if (this.width >= 88) {
                        window.clearTimeout(this.timeout);
                    } else {
                        this.timeout = window.setTimeout(function () {
                            that.run();
                        }, 50);
                    }
                }
            };

        };
    // $.ajaxSetup({global: true});
    $( document )
        .ajaxSend(function () {
            if (!Progress) {
                Progress = progress();
            }
            Progress.start();
        })
        .ajaxError(function (event, jqxhr, settings, thrownError) {
            Progress.stop();
            $.alert('请求错误，状态码：' + jqxhr.status, '错误信息：[ ' + jqxhr.statusText + ' ]，请联系系统管理员');
        })
        .ajaxSuccess(function (event, jqxhr, settings, result) {
            Progress.stop();
            var type = jqxhr.getResponseHeader('content-type');
            // 错误信息
            if (/application\/json/i.test(type) && !result.success) {
                if (result.message === 'login') {
                    $.alert('您没有登录，或者已经登录超时', '<a href="' + webContext + '/login">点击登录</a>');
                } else {
                    if (result.exception) {
                        // 后台java运行异常
                        $.alert('后台处理异常，请联系系统管理员，异常信息如下：', result.error);
                    } else {
                        // 后台业务逻辑异常
                        $.alert('出现异常，信息如下：', result.message || result.error);
                    }
                }
            }
        });

    /**
     * 新的异步请求处理，增加状态消息提示
     * @param $
     */
    (function($) {

        $.fn._load = function (url, param) {
            var that = this;
//			$.alert('正在载入...');
            return $.post(url, param, 'html').done(function (html) {
                that.html(html);
            });
        };

        $.each(['_get', '_post'], function (i, method) {
            jQuery[method] = function (url, data, callback, type) {
                if (jQuery.isFunction(data)) {
                    type = type || callback;
                    callback = data;
                    data = undefined;
                }
//				$.alert('正在处理...');
                return jQuery.ajax({
                    type: method.slice(1),
                    url: url,
                    data: data,
                    success: callback,
                    dataType: type
                });
            };
        });
    })(jQuery);

    /**
     * 表单操作
     * @param $
     */
    (function ($) {

        $.fn._remove = function (option) {
            var defer = $.Deferred(),
                that = this,
                option = option || {},
                message = (option.message || this.data('remove') )|| '确认删除？',
                getUrl = option.getUrl || function (link) {
                    return link.href;
                };

            $.confirm(message).done(function () {
//				$.alert('正在删除');
                $.post(getUrl(that[0])).done(function (data) {
                    if (data.success) {
                        $.alert('删除成功', 1000).done(function(close) {
                            close();
                            defer.resolve(that[0]);
                        });
                    }
                });
            });

            return defer.promise();
        };

        $.fn._modal = function (option) {
            var defer = $.Deferred(),
                option = option || {},
                getUrl = option.getUrl || function (link) {
                    return link.href;
                },
                target = option.target || this.data('load'),
                modal;
            if (typeof target === 'string') {
                modal = $(target);
            } else if (target.jquery) {
                modal = target;
            } else {
                throw new TypeError('target属性设置错误，只能设置为字符串或jquery对象[jquery.ajax.override.js]');
            }

            modal._load(getUrl(this[0])).done(function() {
                modal.modal('show');
                defer.resolve(modal);
            });
            return defer.promise();
        };

        $.fn._save = function (saveUrl, refreshUrl) {
//			$.alert('正在保存...');
            $.post(saveUrl, this.serializeArray())
                .done(function (data) {
                    if (data.success) {
                        if (refreshUrl) {
                            if (typeof refreshUrl === 'function') {
                                $.alert('保存成功', 1000)
                                    .done(function () {
                                        refreshUrl(data);
                                    });
                            } else {
                                $.alert('保存成功，即将跳转', 1000)
                                    .done(function () {
                                        location.replace(refreshUrl + data.data.id);
                                    });
                            }
                        } else {
                            $.alert('保存成功，即将刷新', 1000)
                                .done(function () {
                                    location.reload();
                                });
                        }
                    }
                });
        };

        $(document)
            .on('click.remove-entity-by-url', 'a[data-remove]', function () {
                $(this)._remove().done(function (link) {
                    window.location.reload();
                });
                return false;
            })
            .on('click.edit-entity-by-modal', 'a[data-load]', function () {
                $(this)._modal();
                return false;
            })
            .on('click.pagination-ajax-load', '.pagination [data-target]', function () {
                var $this = $(this);
                $($this.data('target'))._load(this.href);
                return false;
            })
        ;
    })(jQuery);
});