// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 首页：参与测试题按钮跳转
    const startTestBtn = document.getElementById('start-test');
    if (startTestBtn) {
        startTestBtn.addEventListener('click', function() {
            window.location.href = 'test.html';
        });
    }

    // 首页：不做测试题按钮（直接跳剧本杀页面）
    const skipTestBtn = document.getElementById('skip-test');
    if (skipTestBtn) {
        skipTestBtn.addEventListener('click', function() {
            const confirmSkip = confirm('你确定不做测试题吗？将直接进入剧本杀选择页面');
            if (confirmSkip) {
                window.location.href = 'script-kill.html';
            }
        });
    }

    // 测试题表单提交：跳转到剧本杀页面
    const testForm = document.getElementById('test-form');
    if (testForm) {
        testForm.addEventListener('submit', function(e) {
            e.preventDefault(); // 阻止默认提交
            // 模拟提交后跳转（实际项目可添加数据处理逻辑）
            alert('测试提交成功！为你跳转到定制剧本杀页面');
            window.location.href = 'script-kill.html';
        });
    }

    // 地图页面：模拟人数实时变化（可选）
    const updateNumbers = () => {
        // 随机更新人数（模拟实时数据）
        const onlineCount = document.getElementById('online-count');
        if (onlineCount) {
            onlineCount.textContent = Math.floor(Math.random() * 50 + 100);
        }
        const reserveCount = document.getElementById('reserve-count');
        if (reserveCount) {
            reserveCount.textContent = Math.floor(Math.random() * 100 + 300);
        }
        const longxingCount = document.getElementById('longxing-count');
        if (longxingCount) {
            longxingCount.textContent = Math.floor(Math.random() * 20 + 30);
        }
        const kaiyuanCount = document.getElementById('kaiyuan-count');
        if (kaiyuanCount) {
            kaiyuanCount.textContent = Math.floor(Math.random() * 15 + 20);
        }
    };

    // 页面加载时更新一次，之后每30秒更新一次
    updateNumbers();
    setInterval(updateNumbers, 30000);

    // 积分系统功能
    // 初始化积分
    if (!localStorage.getItem('gameScore')) {
        localStorage.setItem('gameScore', '0');
    }
    
    // 初始化已完成的操作状态
    if (!localStorage.getItem('completedActions')) {
        localStorage.setItem('completedActions', JSON.stringify({}));
    }

    // 更新积分显示
    function updateScoreDisplay() {
        const scoreElement = document.getElementById('scoreDisplay');
        if (scoreElement) {
            const currentScore = parseInt(localStorage.getItem('gameScore') || '0');
            scoreElement.textContent = currentScore;
        }
    }

    // 添加积分（带防重复机制）
    function addScore(points, actionId) {
        // 如果提供了actionId，则检查是否已经完成过此操作
        if (actionId) {
            const completedActions = JSON.parse(localStorage.getItem('completedActions') || '{}');
            if (completedActions[actionId]) {
                // 如果操作已完成，则不重复加分
                return false;
            }
            
            // 标记操作为已完成
            completedActions[actionId] = true;
            localStorage.setItem('completedActions', JSON.stringify(completedActions));
        }
        
        const currentScore = parseInt(localStorage.getItem('gameScore') || '0');
        const newScore = currentScore + points;
        localStorage.setItem('gameScore', newScore.toString());
        updateScoreDisplay();
        showScoreNotification(points);
        return true;
    }

    // 显示积分通知
    function showScoreNotification(points) {
        if (points > 0) {
            const notification = document.createElement('div');
            notification.className = 'score-notification';
            notification.textContent = `+${points} 积分`;
            notification.style.cssText = `
                position: fixed;
                top: 20%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #4CAF50;
                color: white;
                padding: 15px 25px;
                border-radius: 50px;
                font-size: 18px;
                font-weight: bold;
                z-index: 9999;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                animation: scoreAnimation 2s ease-out forwards;
            `;
            
            // 添加动画样式
            const style = document.createElement('style');
            style.textContent = `
                @keyframes scoreAnimation {
                    0% { opacity: 0; transform: translate(-50%, -70%); }
                    20% { opacity: 1; transform: translate(-50%, -50%); }
                    80% { opacity: 1; transform: translate(-50%, -50%); }
                    100% { opacity: 0; transform: translate(-50%, -30%); }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
                // 移除样式避免重复添加
                style.remove();
            }, 2000);
        }
    }

    // 检查操作是否已完成
    function isActionCompleted(actionId) {
        const completedActions = JSON.parse(localStorage.getItem('completedActions') || '{}');
        return !!completedActions[actionId];
    }

    // 重置操作状态（用于调试或重置游戏进度）
    function resetActionStatus(actionId) {
        const completedActions = JSON.parse(localStorage.getItem('completedActions') || '{}');
        delete completedActions[actionId];
        localStorage.setItem('completedActions', JSON.stringify(completedActions));
    }

    // 积分查询功能
    window.getGameScore = function() {
        return parseInt(localStorage.getItem('gameScore') || '0');
    };

    // 积分添加功能（带防重复机制）
    window.addGameScore = function(points, actionId) {
        return addScore(points, actionId);
    };

    // 检查操作是否已完成
    window.isActionCompleted = function(actionId) {
        return isActionCompleted(actionId);
    };

    // 重置积分功能
    window.resetGameScore = function() {
        localStorage.setItem('gameScore', '0');
        localStorage.setItem('completedActions', JSON.stringify({}));
        updateScoreDisplay();
    };
    
    // 页面加载时更新积分显示
    updateScoreDisplay();
});