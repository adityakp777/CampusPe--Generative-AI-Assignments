/*
 * ============================================
 *  STEVE'S CHAT // chat.js
 * ============================================
 */

$(function () {

  /* ── State ── */
  let firstMessage  = true;
  let chatHistory   = [];
  let responseIndex = 0;
  let isWaiting     = false;
  let chatCount     = 0;
  let isDark        = false;

  /* ── Mock AI Responses ── */
  const aiResponses = [
    "yo! CSS Flexbox is a one-dimensional layout system. you control either a row OR a column at a time.\n\nquick example:\n\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 16px;\n}\n\njustify-content controls horizontal. align-items controls vertical. that's basically it.",
    "reversing a string in JS:\n\nfunction reverseString(str) {\n  return str.split('').reverse().join('');\n}\n\nconsole.log(reverseString('hello')); // 'olleh'",
    "best study tips:\n\n1. spaced repetition\n2. active recall — test yourself\n3. pomodoro — 25 min focus, 5 min break\n4. teach it to someone\n5. sleep — brain consolidates memory while you sleep",
    "beginner python projects:\n\n- weather app using an API\n- password generator\n- to-do list with file saving\n- number guessing game\n\nstart with the guessing game.",
    "const vs let:\n\nconst — can't be reassigned\nlet — can be reassigned anytime\n\nalways use const by default.",
    "async/await example:\n\nasync function getData() {\n  try {\n    const res  = await fetch('/api/data');\n    const data = await res.json();\n    console.log(data);\n  } catch (err) {\n    console.error(err);\n  }\n}",
    "CSS Grid example:\n\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}",
    "bootstrap 5 grid:\n\ncol-12 = full width\ncol-md-6 = half on medium+\ncol-lg-4 = one third on large+",
    "just keep building things. every project teaches you something new.",
    "great question. keep asking things like that and you will go far.",
  ];

  function getNextResponse() {
    const r = aiResponses[responseIndex % aiResponses.length];
    responseIndex++;
    return r;
  }

  /* ── Helpers ── */
  function getTime() {
    return new Date().toLocaleTimeString([], {
      hour:   '2-digit',
      minute: '2-digit'
    });
  }

  function scrollToBottom() {
    const el = document.getElementById('messagesSection');
    if (el) el.scrollTop = el.scrollHeight;
  }

  function formatText(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  /* ── Clear input ── */
  function clearInput() {
    var $top    = $('#messageInput');
    var $bottom = $('#messageInputBottom');

    $top.val('');
    $bottom.val('');

    if ($top.length)    $top[0].style.height    = '24px';
    if ($bottom.length) $bottom[0].style.height = '24px';

    $('#btnSend').prop('disabled', true);
    $('#btnSendBottom').prop('disabled', true);
  }

  /* ── Typewriter Effect ── */
  function typewriter($bubble, text, done) {
    var chars   = text.split('');
    var i       = 0;
    var current = '';
    var speed   = Math.max(10, Math.min(30, 2000 / chars.length));

    $bubble.html('<span class="tw-cursor">_</span>');

    var interval = setInterval(function () {
      if (i < chars.length) {
        current += chars[i];
        i++;
        $bubble.html(
          formatText(current) +
          '<span class="tw-cursor">_</span>'
        );
        scrollToBottom();
      } else {
        clearInterval(interval);
        $bubble.html(formatText(text));
        if (done) done();
      }
    }, speed);
  }

  /* ── addMessage ── */
  function addMessage(text, sender, useTypewriter) {
    var time        = getTime();
    var isUser      = sender === 'user';
    var name        = isUser ? 'STEVE' : 'AI';
    var avatarClass = isUser ? 'user-avatar-msg' : 'ai-avatar';
    var rowClass    = isUser ? 'user-row' : 'ai-row';
    var bubbleClass = isUser ? 'user-bubble' : 'ai-bubble';
    var avatarLabel = isUser ? 'S' : 'AI';

    var html = '<div class="message-row ' + rowClass + '">' +
      '<div class="msg-avatar ' + avatarClass + '">' + avatarLabel + '</div>' +
      '<div class="message-content">' +
        '<div class="message-meta">' +
          '<span class="message-name">' + name + '</span>' +
          '<span class="message-time">' + time + '</span>' +
        '</div>' +
        '<div class="message-bubble ' + bubbleClass + '"></div>' +
      '</div>' +
    '</div>';

    $('#messagesContainer').append(html);

    var $bubble = $('#messagesContainer .message-row:last-child .message-bubble');

    if (useTypewriter && !isUser) {
      typewriter($bubble, text, function () {
        isWaiting = false;
      });
    } else {
      $bubble.html(formatText(text));
    }

    chatHistory.push({ sender: sender, text: text, time: time });
    scrollToBottom();
  }

  /* ── sendMessage ── */
  function sendMessage(overrideText) {
    if (isWaiting) return;

    var text = '';

    if (overrideText) {
      text = overrideText;
    } else if (firstMessage) {
      text = $('#messageInput').val().trim();
    } else {
      text = $('#messageInputBottom').val().trim();
    }

    if (!text) return;

    isWaiting = true;
    clearInput();

    if (firstMessage) {
      $('#welcomeScreen').remove();
      $('#inputArea').show();
      firstMessage = false;
      setTimeout(function () {
        $('#messageInputBottom').focus();
      }, 100);
    }

    addMessage(text, 'user', false);

    $('#typingIndicator').show();
    scrollToBottom();

    var delay = 1000 + Math.random() * 1000;
    setTimeout(function () {
      $('#typingIndicator').hide();
      addMessage(getNextResponse(), 'ai', true);
    }, delay);
  }

  /* ── Input resize + enable button ── */
  $(document).on('input', '#messageInput, #messageInputBottom', function () {
    var hasText = $(this).val().trim().length > 0;
    var btnId   = this.id === 'messageInput' ? '#btnSend' : '#btnSendBottom';
    $(btnId).prop('disabled', !hasText);
    this.style.height = '24px';
    if (this.scrollHeight > 24) {
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    }
  });

  /* ── Enter to send ── */
  $(document).on('keydown', '#messageInput, #messageInputBottom', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  /* ── Send buttons ── */
  $(document).on('click', '#btnSend', function () {
    sendMessage();
  });

  $(document).on('click', '#btnSendBottom', function () {
    sendMessage();
  });

  /* ── Suggestion pills ── */
  $(document).on('click', '.pill', function () {
    sendMessage($(this).data('prompt'));
  });

  /* ── Attach button ── */
  $(document).on('click', '#btnAttach, #btnAttachBottom', function () {
    alert('// FILE ATTACH COMING SOON //');
  });

  /* ── Delete session button ── */
$(document).on('click', '.delete-session', function (e) {
  e.stopPropagation();
  $(this).closest('.history-item').remove();
  location.reload();
});

  /* ── History items ── */
  $(document).on('click', '.history-item', function (e) {
    /* Ignore if delete button was clicked */
    if ($(e.target).hasClass('delete-session') ||
        $(e.target).closest('.delete-session').length) return;

    if ($(this).hasClass('active')) {
      closeSidebar();
      return;
    }

    $('.history-item').removeClass('active');
    $(this).addClass('active');
    closeSidebar();

    $('#messagesContainer').empty();
    $('#welcomeScreen').remove();
    $('#inputArea').hide();
    firstMessage  = true;
    chatHistory   = [];
    isWaiting     = false;

    var sessionName = $(this).text().trim();

    var html = '<div class="session-ended" id="welcomeScreen">' +
      '<div class="session-ended-inner">' +
        '<p class="session-title">// SESSION ARCHIVE //</p>' +
        '<p class="session-name">' + sessionName + '</p>' +
        '<p class="session-msg">[ THIS SESSION IS NO LONGER AVAILABLE ]</p>' +
        '<p class="session-sub">// start a new chat to continue //</p>' +
        '<button class="btn-new-chat" id="btnNewChatSession" ' +
          'style="margin-top:20px;display:inline-block;width:auto;padding:8px 24px;">' +
          '+ NEW CHAT' +
        '</button>' +
      '</div>' +
    '</div>';

    $('#messagesSection').prepend(html);
  });

  $(document).on('click', '#btnNewChatSession', function () {
    $('#btnNewChat').trigger('click');
  });

  /* ── New Chat ── */
  $('#btnNewChat').on('click', function () {
    $('#messagesContainer').empty();
    $('#welcomeScreen').remove();
    $('#inputArea').hide();
    chatHistory   = [];
    firstMessage  = true;
    responseIndex = 0;
    isWaiting     = false;
    chatCount++;

    var html = '<div class="welcome-screen" id="welcomeScreen">' +
      '<div class="welcome-content">' +
        '<div class="welcome-badge">[ AI ONLINE ]</div>' +
        '<h1 class="welcome-title">hello,<br/>steve.</h1>' +
        '<p class="welcome-sub">// what do you want to know today? //</p>' +
        '<div class="welcome-input">' +
          '<button class="btn-attach" id="btnAttach">' +
            '<i class="fa-solid fa-paperclip"></i>' +
          '</button>' +
          '<textarea id="messageInput" class="message-textarea" ' +
            'placeholder="type here and hit enter..." rows="1"></textarea>' +
          '<button class="btn-send" id="btnSend" disabled>' +
            '<i class="fa-solid fa-paper-plane"></i> SEND' +
          '</button>' +
        '</div>' +
        '<p class="input-footer">// AI can make mistakes. verify important info. //</p>' +
        '<div class="suggestion-pills">' +
          '<div class="pill" data-prompt="Explain how CSS Flexbox works">&lt;/&gt; Code</div>' +
          '<div class="pill" data-prompt="Help me write something creative">✏ Write</div>' +
          '<div class="pill" data-prompt="Teach me something interesting">★ Learn</div>' +
          '<div class="pill" data-prompt="Give me some life advice">☻ Life stuff</div>' +
        '</div>' +
      '</div>' +
    '</div>';

    $('#messagesSection').prepend(html);

    var $li = $(
      '<li class="history-item active">' +
        '+ new session ' + chatCount +
        '<span class="delete-session" title="delete">' +
          '<i class="fa-solid fa-trash"></i>' +
        '</span>' +
      '</li>'
    );
    $('.history-item').removeClass('active');
    $('#historyList').prepend($li);

    closeSidebar();

    setTimeout(function () {
      $('#messageInput').focus();
    }, 100);
  });

  /* ── Mobile sidebar ── */
  function openSidebar() {
    $('#sidebar').addClass('open');
    $('#sidebarOverlay').addClass('active');
  }

  function closeSidebar() {
    $('#sidebar').removeClass('open');
    $('#sidebarOverlay').removeClass('active');
  }

  $('#btnHamburger').on('click', openSidebar);
  $('#sidebarOverlay').on('click', closeSidebar);

  /* ── Dark Mode Toggle ── */
  $('#btnDark').on('click', function () {
    isDark = !isDark;
    if (isDark) {
      $('html').attr('data-theme', 'dark');
      $('#btnDark').html('<i class="fa-solid fa-sun"></i>');
    } else {
      $('html').removeAttr('data-theme');
      $('#btnDark').html('<i class="fa-solid fa-moon"></i>');
    }
  });

  /* ── Export ── */
  $('#btnExport').on('click', function () {
    if (chatHistory.length === 0) {
      alert('// NO MESSAGES TO EXPORT YET //');
      return;
    }
    var lines = chatHistory.map(function (m) {
      return '[' + m.time + '] ' +
        (m.sender === 'user' ? 'STEVE' : 'AI') +
        ':\n' + m.text + '\n';
    });
    var content = "STEVE'S CHAT EXPORT\n" +
      '='.repeat(30) + '\n\n' + lines.join('\n');
    var blob    = new Blob([content], { type: 'text/plain' });
    var url     = URL.createObjectURL(blob);
    var a       = document.createElement('a');
    a.href      = url;
    a.download  = 'steve-chat-' + Date.now() + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  });

  /* ── Init ── */
  setTimeout(function () {
    $('#messageInput').focus();
  }, 100);

});