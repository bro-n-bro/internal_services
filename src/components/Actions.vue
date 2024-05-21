<template>
    <section class="actions">
        <div class="title">
            {{ $t('message.actions_title') }}
        </div>

        <div class="line"></div>

        <div class="list">
            <router-link to="/multisend/cosmoshub" class="item">
                <div class="icon">
                    <img src="@/assets/ic_multisend.svg" alt="" loading="lazy">
                </div>

                <span>Multisend</span>

                <svg class="check"><use xlink:href="@/assets/sprite.svg#ic_check"></use></svg>
            </router-link>

            <router-link to="/ibs" class="item">
                <div class="icon">
                    <img src="@/assets/ic_ibs.svg" alt="" loading="lazy">
                </div>

                <span>IBS</span>

                <svg class="check"><use xlink:href="@/assets/sprite.svg#ic_check"></use></svg>
            </router-link>

            <router-link to="/ibc_route/cosmoshub" class="item">
                <div class="icon">
                    <img src="@/assets/ic_ibc_route.svg" alt="" loading="lazy">
                </div>

                <span>IBC route</span>

                <svg class="check"><use xlink:href="@/assets/sprite.svg#ic_check"></use></svg>
            </router-link>
        </div>
    </section>
</template>


<script setup>

</script>


<style scoped>
.actions
{
    position: sticky;
    top: 24px;

    padding: 9px;

    border-radius: 30px;
}

.actions:before
{
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    content: '';

    opacity: .7;
    border: 1px solid #915cd4;
    border-radius: 30px;
    background: radial-gradient(82.21% 105.43% at 50% 13.3%, rgba(71, 26, 146, .70) 0%, rgba(35, 6, 83, .70) 63.74%, rgba(0, 0, 0, .70) 100%), linear-gradient(132deg, #8f00b0 -12.79%, #570099 45.8%, #1b0044 99.42%);

            backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
}


.actions .title
{
    font-size: 24px;
    font-weight: 600;
    line-height: 100%;

    position: relative;
    z-index: 3;

    padding: 16px 20px;
}


.actions .line
{
    position: relative;
    z-index: 3;

    height: 1px;
    margin-bottom: 10px;

    background: linear-gradient(135deg,  rgba(255,255,255,0) 0%,rgba(250,195,255,.6) 50%,rgba(255,255,255,0) 100%);
}


.actions .list
{
    position: relative;
    z-index: 3;
}


.actions .list > * + *
{
    margin-top: 6px;
}


.actions .item
{
    font-size: 18px;
    font-weight: 500;
    line-height: 100%;

    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;

    width: 100%;
    padding: 10px;

    transition: background .2s linear;
    text-align: left;
    text-decoration: none;

    color: currentColor;
    border-radius: 10px;
}


.actions .item .icon
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;

    width: 44px;
    height: 41px;
}


.actions .item .icon img
{
    display: block;

    width: 100%;
    height: 100%;
}


.actions .item span
{
    width: calc(100% - 108px);
    margin-left: 14px;
}


.actions .item .check
{
    display: block;

    width: 24px;
    height: 24px;
    margin-left: auto;

    transition: opacity .2s linear;

    opacity: 0;
}


.actions .item:hover,
.actions .item.router-link-active
{
    background: #141414;
}


.actions .item.router-link-active .check
{
    opacity: 1;
}





</style>