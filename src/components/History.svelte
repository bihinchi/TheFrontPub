<script>
    import HistoryRecord from "./HistoryRecord.svelte";
	import { history } from '../js/stores';
    import debounce from 'lodash/debounce'

    
    let scroller, records = [], start = 0, end, historytime = new Date();

    const getSubSet = (records) => {
        if (!records.length) return records;
        end ??=  records.length > 20 ? 20 : records.length;
        return records.slice(start, end)
    }

    $: records = getSubSet($history)

    const timeUpdater = () => {

        const rect = scroller.getBoundingClientRect();
        const middleX = (rect.left + rect.right) / 2;

        for (let index = 0; index < records.length; index++) {

            const record = records[index];
            const recordDom = scroller.children[index];

            if (recordDom.children.length == 0) continue;

            let recordRect = recordDom.getBoundingClientRect();

            if (recordRect.left < middleX &&  middleX < recordRect.right) {


                const m = (record.endTime - record.startTime) 
                        / (recordRect.right - recordRect.left);

                const b = record.startTime - recordRect.left * m;

                historytime = new Date(middleX * m + b)

            }
        }
    }

    const updateScroll = () =>  {

        const rect = scroller.getBoundingClientRect();
        const maxScroll = scroller.scrollWidth - rect.width;
  
        if (end < $history.length && maxScroll - scroller.scrollLeft < rect.width / 1.5 ) {
            
            end++;
            if (records.length > 30) start +=5
            scroller.scroll(Math.floor(scroller.scrollLeft - rect.width / 5), scroller.scrollTop)
            $history = $history
 
        } else if (start > 0 && scroller.scrollLeft < rect.width / 1.5) {
            
            start--;
            if (records.length > 30) end -=5
            scroller.scroll(Math.floor(rect.width / 3), scroller.scrollTop);
            $history = $history
        }

        timeUpdater();
    }

    const scrollUpdater =  debounce(updateScroll, 300);

    const onScroll = () => {
        scrollUpdater();
        timeUpdater();
    }
    

</script>

<div>
    <h4>{historytime.toLocaleString()}</h4>
</div>

<article on:scroll={onScroll} bind:this={scroller}>

    {#each records as record }
        <HistoryRecord {record} />
    { /each }

</article>

<style>

    div {
        display: flex;
        justify-content: center;
        font-size: 1.2vw;
    }

    article {
        display: flex;
        overflow: auto;
        white-space: nowrap;
        justify-content: space-between;
        max-width: 91vw;
        min-height: 60vh;
        font-size: 3.0vw;

    }

    
</style>