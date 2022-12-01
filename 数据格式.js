场景图
scnce:''

图层数据格式
[{
		//设计稿圆点对应坐标
		left: '10%',
		top: '20%',
		url: '', //图层路劲
		shawUrl: '', //图层底部阴影路劲
		imageId:'',//图层唯一标识
		shawId:'',///图层底部阴影唯一标识
		layerIndex:1,//图层层级
		id:''//圆点id
	},
	{
		//设计稿圆点对应坐标
		left: '10%',
		top: '20%',
		url: '', //图层路劲(背景透明)
		shawUrl: '', //图层底部阴影路劲（背景透明）
		imageId:'',//图层唯一标识
		shawId:'',///图层底部阴影唯一标识
		layerIndex:2,//图层层级
		id:''//圆点id
}]

圆点上方选择数据结构
[
	{
		image:'',//展示图
		url: '', //图层替换路劲
		shawUrl: '', //图层底部阴影替换路劲
		imageId:'',//图层唯一标识
		shawId:'',///图层底部阴影唯一标识
		roundId:'',//与关联圆点id相同
		isLinkMany:false//是否关联多个
	},
	{
		image:'',//展示图
		url: '', //图层替换路劲
		shawUrl: '', //图层底部阴影替换路劲
		imageId:'',//图层唯一标识
		shawId:'',///图层底部阴影唯一标识
		roundId:'',//与关联圆点id相同
		isLinkMany:false//是否关联多个
	},
	{
		image:'',//展示图
		url: '', //图层替换路劲1
		shawUrl: '', //图层底部阴影替换路劲1
		imageId:'',//图层唯一标识1
		shawId:'',///图层底部阴影唯一标识2
		url2: '', //图层替换路劲2
		shawUrl2: '', //图层底部阴影替换路劲2
		imageId2:'',//图层唯一标识2
		shawId2:'',///图层底部阴影唯一标识2
		roundId:'',//与关联圆点id相同
		isLinkMany:true //是否关联多个
	}
]