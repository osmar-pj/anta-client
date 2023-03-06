<template>
    <div class="md:col-6 md:col-offset-3 h-screen">
        <div class="surface-section px-4 py-5 md:px-6 lg:px-8" v-if="loading">
            <Skeleton width="25%" height="1rem" class="mb-2"></Skeleton>
            <div>
                <Skeleton width="40%" height="2rem" class="mb-4"></Skeleton>
                <Skeleton width="100%" height="1rem" class="mb-4"></Skeleton>
            </div>
            <div>
                <Skeleton width="40%" height="2rem" class="mb-4"></Skeleton>
                <Skeleton width="100%" height="1rem" class="mb-4"></Skeleton>
            </div>
            <div>
                <Skeleton width="40%" height="2rem" class="mb-4"></Skeleton>
                <Skeleton width="100%" height="1rem" class="mb-4"></Skeleton>
            </div>
        </div>
        <div class="surface-section px-4 py-5 md:px-6 lg:px-8 text-xs md:text-xl h-full" v-if="!loading">
            <ul class="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                <li>
                    <a class="text-500 no-underline line-height-3 cursor-pointer">Mining</a>
                </li>
                <li class="px-2">
                    <i class="pi pi-angle-right text-500 line-height-3"></i>
                </li>
                <li>
                    <span class="text-900 line-height-3">wasser</span>
                </li>
            </ul>

            <h2 class="">STATUS EQUIPMENT WASSER</h2>
            
            <div class="flex align-items-start flex-column lg:justify-content-between lg:flex-row mb-6">
                <div>
                    <div class="font-medium text-3xl text-900 mt-5">HT57</div>
                    <div class="flex align-items-center text-700 flex-wrap">
                        <div class="mr-5 flex align-items-center mt-3">
                            <i class="pi pi-check-circle mr-2 text-green-500"></i>
                            <span>wasser On</span>
                        </div>
                        <div class="mr-5 flex align-items-center mt-3">
                            <i class="pi pi-circle-fill mr-2 text-green-500"></i>
                            <span>Water OK</span>
                        </div>
                    </div>
                </div>
            </div>
            <hr>
    
            <div class="flex align-items-start flex-column lg:justify-content-between lg:flex-row mb-6">
                <div>
                    <div class="font-medium text-3xl text-900 mt-5">HT61</div>
                    <div class="flex align-items-center text-700 flex-wrap">
                        <div class="mr-5 flex align-items-center mt-3">
                            <i class="pi pi-times mr-2 text-red-500"></i>
                            <span>wasser Off</span>
                        </div>
                        <div class="mr-5 flex align-items-center mt-3">
                            <i class="pi pi-circle-fill mr-2 text-blue-500"></i>
                            <span>Refill water</span>
                        </div>
                    </div>
                </div>
            </div>
            <hr>
    
            <div class="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                <div>
                    <div class="font-medium text-3xl text-900 mt-5">HT62</div>
                    <div class="flex align-items-center text-700 flex-wrap">
                        <div class="mr-5 flex align-items-center mt-3">
                            <i class="pi pi-check-circle mr-2 text-green-500"></i>
                            <span>wasser On</span>
                        </div>
                        <div class="mr-5 flex align-items-center mt-3">
                            <i class="pi pi-circle-fill mr-2 text-green-500"></i>
                            <span>Water OK</span>
                        </div>
                    </div>
                </div>
            </div>
    
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
    setup() {
        const loading = ref(true)

        onMounted(() => {
            setTimeout(() => {
                loading.value = false
            }, 2000)
        })

        return { loading }
    }
}
</script>

<style lang="scss" scoped>

</style>