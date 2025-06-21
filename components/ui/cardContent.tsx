import { useLanguage } from "@/contexts/language-context";

export const CardContentComponent = ({loading,item,index}:{loading:boolean,item:any,index:string|number}) => {
    const { t } = useLanguage()
    
  return (
    <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {loading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        item.value 
                        
                      )}
                    </p>
                    <p className={`text-sm ${item.color}`}>
                      {item.change} {t("dashboard.lastMonth")}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                </div>
              </div>
  );
}