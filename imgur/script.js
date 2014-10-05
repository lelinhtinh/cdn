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
    if ($('#img_list li').length) {
        if (!$('#img_list li.loading').length && $('.img_bbcode').length) {
            var all = [];
            $('#img_list li').each(function() {
                var $this = $(this);
                if ($this.hasClass('success')) {
                    all.push($this.find('.img_bbcode').val());
                } else {
                    all.push("Lỗi ảnh " + $this.find("img").data("name"));
                }
            });
            $('#img_mess').val(all.join('\n\n'));
            $('#img_desc').val($('.img_bbcode:first').data('thumb'));
            $('#img_data').slideDown(function() {
                $('html,body').animate({
                    scrollTop: $('#img_data').offset().top
                });
            });
        }
    } else {
        $('#img_reset').click();
    }
}

$('#img_choose_wrap').on('change', '#img_choose', function() {
    $('#img_upload').prop('disabled', true);
    $.each(this.files, function(index, file) {
        if (/^image\/(jpeg|png|bmp|gif)$/.test(this.type)) {
            var n = file.name;
            if (!$('img[data-name="' + n + '"]').length) {
                var reader = new FileReader();
                var image = new Image();
                reader.readAsDataURL(file);
                reader.onload = function(_file) {
                    image.src = _file.target.result;
                    image.onerror = function() {
                        console.log('Image Error');
                        return false;
                    };
                    image.onload = function() {
                        var w = this.width;
                        var h = this.height;
                        var $img = $(this).attr({
                            'class': 'watermark',
                            'data-width': w,
                            'data-height': h,
                            'data-name': n
                        });
                        $('#img_list').append($img);
                        $img.wrap('<li class="ui-state-default"></li>');
                        $img.after('<div class="img_close">close</div><div class="img_details"><p><strong>Name</strong>: ' + sliceStr(n) + '</p><p><strong>Size</strong>: (' + w + 'x' + h + ') ' + formatSizeUnits(file.size) + '</p></div><div class="img_progress_bar"><div class="img_progress"></div></div>');
                    };
                };
            }
        }
    });

    $('#img_choose_wrap').html('<input id="img_choose" type="file" multiple accept="image/png, image/jpeg, image/gif, image/bmp" /><span>Chọn ảnh</span>');

    setTimeout(function() {
        wmark.init({
            "path": "data:image/png;base64,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"
        });
    }, 500);
    $("#img_list").sortable({
        placeholder: "ui-state-highlight",
        update: function(event, ui) {
            checkUpload();
        }
    }).disableSelection();
    $('#img_upload').prop('disabled', false);
});

$('#img_upload').click(function() {
    $('#img_list li:not(.success)').each(function(index, el) {
        var $this = $(this);
        var dataImg = $this.find('img').attr('src').replace(/data:image\/.+;base64\,/, '');
        $this.removeClass('error').addClass('loading');
        $.ajax({
            url: 'https://api.imgur.com/3/image',
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener('progress', function(evt) {
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
                Authorization: "Client-ID 7fa4ab74ed3d733"
            },
            data: {
                image: dataImg,
                type: 'base64'
            },
            success: function(response) {
                var link = response.data.link;
                $this.removeClass('loading').addClass('success');
                $this.find('.img_details').html('<p><input class="img_bbcode" data-thumb="' + link.replace(/(.+)(\.)(png|jpg|gif|bmp)$/, '$1s.$3') + '" onclick="this.select();" type="text" value="[img]' + link + '[/img]" /></p><p><a href="' + link + '" target="_blank">Xem ảnh</a><a href="http://imgur.com/delete/' + response.data.deletehash + '" target="_blank">Xóa ảnh</a></p>');
                checkUpload();
            },
            error: function(response) {
                $this.removeClass('loading').addClass('error');
                checkUpload();
                console.warn(response);
            }
        });
    });
});

$("#img_reset").click(function() {
    $('#img_list').empty();
    $('#img_data').slideUp();
});

$('#img_list').on('click', '.img_close', function() {
    $(this).parent().remove();
    checkUpload();
});
