class Datatable
    #iTotalRecords;// 数据库中的结果总行数
    #iTotalDisplayRecords;// 搜索过滤后的总行数
    #start;// 起始行数
    #search[value];// 搜索的字符串
    #length;// 页面大小
    #order['column'];// 需要排序的列
    #order['dir'];// 排序方式
    #List<Map<String, String>> aaData;// 结果集
    attr_accessor :iTotalRecords,:iTotalDisplayRecords,:start,:search,:length,:order,:aaData
end