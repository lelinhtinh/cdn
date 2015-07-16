/*  @preserve
 *  Project: Phutu uploader
 *  Description: Uploader & photo poster for Phutu's forum
 *  Author: Zzbaivong (devs.forumvi.com)
 *  Version: 1.1
 *  License: CC BY 3.0
 */
(function ($) {

    'use strict';

    function formatSizeUnits(bytes) {
        if (bytes >= 1000000000) {
            bytes = (bytes / 1000000000).toFixed(2) + ' GB';
        } else if (bytes >= 1000000) {
            bytes = (bytes / 1000000).toFixed(2) + ' MB';
        } else if (bytes >= 1000) {
            bytes = (bytes / 1000).toFixed(2) + ' KB';
        } else if (bytes > 1) {
            bytes = bytes + ' bytes';
        } else if (bytes == 1) {
            bytes = bytes + ' byte';
        } else {
            bytes = '0 byte';
        }
        return bytes;
    }

    function sliceStr(str) {
        if (str.length > 30) {
            str = str.slice(0, 15) + "..." + str.slice(str.length - 10)
        }
        return str;
    }


    function checkUpload() {
        if ($img_list.find('li').length) {
            if (!$img_list.find('li.loading').length && $('.img_bbcode').length) {
                var all = [];
                $img_list.find('li').each(function () {
                    var $this = $(this);
                    if ($this.hasClass('success')) {
                        all.push($this.find('.img_bbcode').val());
                    } else {
                        all.push("Lỗi ảnh " + $this.find("img").data("name"));
                    }
                });
                $img_mess.val(all.join('\n\n'));
                $img_desc.val($('.img_bbcode:first').data('thumb'));
                $img_data.slideDown(function () {
                    $htmlbody.animate({
                        scrollTop: $img_data.offset().top
                    });
                });
            }
        } else {
            $img_reset.click();
        }
    }

    var $img_list = $('#img_list'),
        $img_upload = $('#img_upload'),
        $img_reset = $('#img_reset'),
        $img_choose_wrap = $('#img_choose_wrap'),
        $img_data = $('#img_data'),
        $htmlbody = $('html,body'),
        $img_mess = $('#img_mess'),
        $img_desc = $('#img_desc');
        
    var postto = location.search;
    if(postto !== '' && postto.indexOf('?postto=') === 0) {
        $('#img_type').val(postto.slice(8));
    }
    $img_choose_wrap.on('change', '#img_choose', function () {
        $img_upload.prop('disabled', true);
        $.each(this.files, function (index, file) {
            if (/^image\/(jpeg|png|bmp|gif)$/.test(this.type)) {
                var n = file.name;
                if (!$('img[data-name="' + n + '"]').length) {
                    var reader = new FileReader();
                    var image = new Image();
                    reader.readAsDataURL(file);
                    reader.onload = function (_file) {
                        image.src = _file.target.result;

                        var $img = $('<img>', {
                            src: _file.target.result
                        });
                        $img.watermark({
                            'path': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAAAYCAYAAACC2BGSAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH3goGCRoayaWorAAAAAd0RVh0QXV0aG9yAKmuzEgAAAAMdEVYdERlc2NyaXB0aW9uABMJISMAAAAKdEVYdENvcHlyaWdodACsD8w6AAAADnRFWHRDcmVhdGlvbiB0aW1lADX3DwkAAAAJdEVYdFNvZnR3YXJlAF1w/zoAAAALdEVYdERpc2NsYWltZXIAt8C0jwAAAAh0RVh0V2FybmluZwDAG+aHAAAAB3RFWHRTb3VyY2UA9f+D6wAAAAh0RVh0Q29tbWVudAD2zJa/AAAABnRFWHRUaXRsZQCo7tInAAAF6ElEQVRYhe2ZIXDbWhaGv7uzMytWQT30XFSXCZqtH3OZi+qgqLBoU+aiOqgp8hS5QXaQzaxFDrtaFLOYJUEyk5i0yFry/gWW8tTEfU3Svum83f4zmvGV7v3v+c+995wj2UjiB74Of/neBvwv4EFONMYMjTG2vFrf2qg/HSTd6wIanufJWqt+vy9gfF+O3+EeAhaYA81vxftHXw/aiY7j0G63efLkybdaS4wxLd/3D6y17X6/3wX+8c3I/2D89XsbUIPjui7tdpv1eg3gfGd77oxrJxpjAmC/bP4TeAK0ARdYAseSTndw+MaYKVDFxhVwKGlljHGAEdAAUuC1pLScrwW8ZeusJeDf4O0YY2z5e1njP5E0qdk9AppADryRdHnTQGPMAPg7UADvJUW1Z25po1famNf4/lWOa5XtVTnH+pMJavFoY63VdDqV53kajUa6uLhQkiSaz+fyPE/AAdBoNBqSpPF4rGazqfl8riRJlCSJRqORXNctygVodzodWWsVBIGAfm2+xXA4lLVWnucpCAKdn59LkpIkkbVWlT2AptNp9TuucbR836/zD3bFLNd161xx/RkwCIJA1lp1Oh1VfP1+X81mU4vFQlmWKUkSDYdDOY6TcyNe18kkSZvNRlmWKcsyWWsVx7EkKY7jypGdyolxHGuz2VyLrvoOh0MB50A7CAJJ0mAw+EQkYK21kqRGo/FFJ8ZxrDiObzqx3W63d/LfcJRdLBaSJN/3BbRrz+Lz83NtNhu5rquKr9IWx/EubfMvOfHXMuuKbaZMptOpJFXZeF45McuyX8sdsAGs67pFkiTabDZyHEdA965OBM4qAePxWEBSzm+B7CudGPR6vboTRvWdLKlarKziy7Ks2t1ZqU03tLkV/63snKapOTo6yoGfJP0C7B0fHwPw4sULymMKQBiGZjKZLKu+eZ7PoyjCcRyazSZsY+Fd8eZG+1TSL6UNq3vw7MIsDMN/53lOr9cD6JXxer/URKlxVg0Iw5BS2+NS2+xz2j5X4uQqEwCwWq22GjzPg22iqeNSUl7+LoqiAMB13V19vwskFUVRTCeTCZ7n0el0XKAH9IIg4PLykiiKUrYJtY47aftinSgpz/N8vV6vq8F/VpycnJwAsL+/DzDsdDqu53mU92dss/e9cdc60W00GpQ7suA71XDlSfAeMlbS0hizWq1WfrfbxXVdd39/n6IomEwmAMcP5f7iTjTG9Mrtz+XlJcD6HvxFWTjz6NEjgJ9LTocdRz3P83qzvlDFer3GcRwcx3GMMZXY5g57PWNMYoxReY1rj0+Oj49xHIder0e32+X09JQ0TZfaUV/eFbec6DgOrus2jDFnxhjred703bt3ALx//x5gV8H9OVyWjqfX6+G67l5ZQCcHBwe+739SX6eVw1utFpTFtjEmAdoVT7fbBVgYYy6azeaosq2GThAEniTiOIZaIgRms9nsP0VRMBwOcRynOsrH99B0C7ec6HkeSZJgrW1Za9txHOP7PoeHh1WG+XAP/jxN02UV0M/Ozv5mrW1nWea+ffuWKlCXKPI8X4VhSLPZ5Pz83LXWts/Ozjy4zp6Mx2Ostf7FxUXz4uLiXnFaUprn+TwMQxzHIU1TwjAsqGXlh2BXicPr16+v26enpzx//pzBYHAJPKfMUlEUcXV1dXN4cXV1RRRF1dEsgFevXr0qjo6OgO0ihWHI06dPmc1mRFFUObMA3rx8+ZKPHz9eH+0yDqer1Sp89uwZy+US3/dZr9fs7e2xt7dHFEXV+zZAkaYpURSxXC53aT758OEDURRxeHgIMJFUrWaR53ldW32Vd2nb4maxXRa0G34rdC3Qp1ZcAoPy/gJo1e432X7GssDwxv0FELMtoudsXyEXFX+tr1/jqOboso2R74AzfnsRGLB9773+fFb2G9fGBzuK7375bFTXpd/5HPc5bZIwZQeMMZLEer3m8ePHa0mPdy3jD9zGj78HvgHqdWJ6eHjo3TrvP/BF1I9zC+iU90NJX/u++n+Dayf+wMPxX4HMlmxOzyF3AAAAAElFTkSuQmCC',
                            done: function (imgURL) {
                                var w = this.width;
                                var h = this.height;
                                $img.attr({
                                    'src': imgURL,
                                    'class': 'watermark',
                                    'data-width': w,
                                    'data-height': h,
                                    'data-name': n
                                });
                                $img_list.append($img);
                                $img.wrap('<li class="ui-state-default"></li>');
                                $img.after('<div class="img_close">close</div><div class="img_details"><p><strong>Name</strong>: ' + sliceStr(n) + '</p><p><strong>Size</strong>: (' + w + 'x' + h + ') ' + formatSizeUnits(file.size) + '</p></div><div class="img_progress_bar"><div class="img_progress"></div></div>');
                            }
                        });
                    };
                }
            }
        });

        $img_choose_wrap.html('<input id="img_choose" type="file" multiple accept="image/*" /><span>Chọn ảnh</span>');

        $img_list.sortable({
            placeholder: "ui-state-highlight",
            update: function (event, ui) {
                checkUpload();
            }
        }).disableSelection();

        $img_upload.prop('disabled', false);
    });

    $img_upload.click(function () {
        $img_list.find('li:not(.success)').each(function (index, el) {
            var $this = $(this);
            var dataImg = $this.find('img').attr('src').replace(/data:image\/.+;base64\,/, '');
            $this.removeClass('error').addClass('loading');
            $.ajax({
                url: 'https://api.imgur.com/3/image',
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener('progress', function (evt) {
                        if (evt.lengthComputable) {
                            $this.find('.img_progress').css({
                                width: (evt.loaded / evt.total * 100) + '%'
                            });
                        }
                    }, false);
                    return xhr;
                },
                method: "POST",
                headers: {
                    Authorization: "Client-ID 376e1e3bc7aaf7c"
                },
                data: {
                    image: dataImg,
                    type: 'base64'
                },
                success: function (response) {
                    var link = response.data.link;
                    $this.removeClass('loading').addClass('success');
                    $this.find('.img_details').html('<p><input class="img_bbcode" data-thumb="' + link.replace(/(.+)(\.)(png|jpg|gif|bmp)$/, '$1s.$3') + '" onclick="this.select();" type="text" value="[img]' + link + '[/img]" /></p><p><a href="' + link + '" target="_blank">Xem ảnh</a><a href="http://imgur.com/delete/' + response.data.deletehash + '" target="_blank">Xóa ảnh</a></p>');
                    checkUpload();
                },
                error: function (response) {
                    $this.removeClass('loading').addClass('error');
                    checkUpload();
                    console.warn(response);
                }
            });
        });
    });

    $img_reset.click(function () {
        $img_list.empty();
        $img_data.slideUp();
    });

    $img_list.on('click', '.img_close', function () {
        $(this).parent().remove();
        checkUpload();
    });

})(jQuery);
