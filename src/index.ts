interface PullRefreshOptions {
    container: HTMLElement
    onRefresh: () => Promise<void>
    indicatorRender?: (status: 'idle' | 'pulling' | 'loading', distance: number) => string
    threshold?: number
}

function initPullRefresh({ container, onRefresh, indicatorRender, threshold = 60 }: PullRefreshOptions) {
    function dampedPull(deltaY: number): number {
        if (deltaY <= threshold) return deltaY
        return threshold + (deltaY - threshold) * 0.2
    }

    function updateStatus(status: 'idle' | 'pulling' | 'loading', distance: number) {
        indicator.innerHTML = indicatorRender?.(status, distance) || ''
    }

    async function onTouchEnd() {
        if (!pulling) return
        pulling = false

        indicator.style.transition = 'transform 0.3s'
        container.style.transition = 'all 0.3s'

        if (distance >= threshold) {
            updateStatus('loading', 0)
            container.style.transform = `translateY(${threshold}px)`
            container.style.clipPath = `inset(0px 0px calc(${threshold}px))`
            indicator.style.transform = `translateY(${threshold}px)`
            await onRefresh()
        }

        container.style.transform = 'translateY(0)'
        container.style.clipPath = `inset(0px 0px calc(0px))`
        indicator.style.visibility = 'hidden'
        updateStatus('idle', 0)
        distance = 0
        vibrateOnce = false
    }

    const { top } = container.getBoundingClientRect()
    const parentNode = container.parentNode as HTMLElement
    parentNode.style.position ||= 'relative'
    let vibrateOnce = false

    const indicator = document.createElement('div')
    indicator.style.cssText = `
      position: fixed;
      top: ${top - 40}px;
      left: 0;
      width: 100%;
      text-align: center;
      pointer-events: none;
      z-index: 10;
    `
    parentNode.prepend(indicator)
    container.style.willChange = 'transform'
    indicator.style.willChange = 'transform'

    let pulling = false
    let startY = 0
    let distance = 0

    container.addEventListener('touchstart', (e) => {
        if (container.scrollTop === 0) {
            startY = e.touches[0].clientY
            pulling = true
        }
    })

    container.addEventListener('touchmove', (e) => {
        if (!pulling) return
        const deltaY = e.touches[0].clientY - startY
        if (deltaY <= 0) return

        if (e.cancelable) {
            e.preventDefault()
            e.stopPropagation()
        }

        distance = dampedPull(deltaY)
        container.style.transition = 'transform 0s'
        indicator.style.transition = 'transform 0s'
        indicator.style.visibility = 'visible'

        requestAnimationFrame(() => {
            container.style.transform = `translateY(${distance}px)`
            indicator.style.transform = `translateY(${distance}px)`
            container.style.clipPath = `inset(0px 0px calc(${distance}px))`
            updateStatus('pulling', distance)
            if (!vibrateOnce && distance >= threshold) {
                navigator.vibrate(1000)
                vibrateOnce = true
            }
        })
    }, { passive: false })

    container.addEventListener('touchend', onTouchEnd)
    container.addEventListener('touchcancel', onTouchEnd)
}

export default initPullRefresh
