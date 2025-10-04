/**
 * 
 * 定义随机的加载提示
 */

const tipMessage = {
    0: "加载中... 正在为您的体验注入魔法",
    1: "数据正在高速冲刺，再等三秒就到终点啦！",
    2: "加载进度：咖啡已热，故事即将开始",
    3: "服务器正在跳一支优雅的探戈，请稍候",
    4: "99% 的内容已就位，剩下1% 正在玩捉迷藏",
    5: "加载中... 正在为您定制专属宇宙",
    6: "网络正在打喷嚏，请捂住耳朵等它安静下来",
    7: "加载进度：正在训练AI说中文，马上就好",
    8: "加载完成度：比萨饼还差一块芝士的完美时刻"
}

/**
 * 获去随机的提示信息
 * @returns {string}
 */
const getRandomTip= ()=>{
    const randomInt = Math.floor(Math.random() * 9);
    return tipMessage[randomInt]
}

export {
    getRandomTip,
    tipMessage
}