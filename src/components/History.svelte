<script>
    import HistoryRecord from "./HistoryRecord.svelte";
	import { history } from '../js/stores';
    import debounce from 'lodash/debounce'
    
    // history dom element
    let scroller;
    
    // subset of shown history
    let records = [];

    const RECORDS_NUM = 20;
    
    // indeces for history subset
    let end, middle, start = 0;
    
    // used to detect if vp contains battling records
    // that can bi skipped
    const MIN5 = 900;
    let group = 0;
    
    // time of current record within history scroller
    let historytime = new Date();

    // used to detect scrolling direction
    let previousLeft = 0, scrollRight = false;

    const getSubSet = (records) => {
        if (!records.length) return records;
        end ??=  records.length > RECORDS_NUM ? RECORDS_NUM : records.length;
        return records.slice(start, end)
    }

    $: records = getSubSet($history)

    const onCenterUpdater = () => {

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
                
                record.length === MIN5 ? group++ : group--; 

                middle = $history.findIndex((el) => el === record);
            }
        }
    }

    const updateScroll = () =>  {

        scrollRight = scroller.scrollLeft > previousLeft;
        previousLeft = scroller.scrollLeft;

        const rect = scroller.getBoundingClientRect();
        const maxScroll = scroller.scrollWidth - rect.width;
        const step = Math.floor(RECORDS_NUM / 3);

        if (scrollRight && end < $history.length && maxScroll - scroller.scrollLeft < rect.width / 4 ) {
            
            end += step;
            start += step;
            scroller.scroll(Math.floor(scroller.scrollLeft - rect.width / 1.5), scroller.scrollTop)
            $history = $history
 
        } else if (!scrollRight && start > 0 && scroller.scrollLeft < rect.width / 4) {
            
            start -= step;
            end -= step;
            scroller.scroll(Math.floor(rect.width / 3), scroller.scrollTop);
            $history = $history
        }

        onCenterUpdater();
    }

    const skipGroup = () => {

        const index = $history.findIndex( (elem, index) => {
            const indexCheck = scrollRight ? index >= middle : index < middle;
            return indexCheck && elem.length !== MIN5;
        })

        if (index == -1) {

            // go to the edge of records
            // if competetion never ended

            if (scrollRight) {
                end = $history.length;
                start = Math.max(end - RECORDS_NUM, 0)
            } else {
                start = 0;
                end = start + RECORDS_NUM;
            }


        } else {

            // skip the group and put the last item
            // to the middle

            const diff = index - middle;

            console.log(diff, start + diff, end+diff);

            start = Math.max(start + diff, 0);
            end = start == 0 ? start + RECORDS_NUM : end + diff;
        }

        group = 0;
        $history = $history
        onCenterUpdater();
    } 

    const scrollUpdater =  debounce(updateScroll, 300);

    const onScroll = () => {
        scrollUpdater();
        onCenterUpdater();
    }
    

</script>

<div>
    <h4>{historytime.toLocaleString()}</h4>
</div>

<article on:scroll={onScroll} bind:this={scroller}>

    {#each records as record }
        <HistoryRecord {record} />
    { /each }

    { #if group > 0 && records.length > RECORDS_NUM }  
        <span class="{ scrollRight ? 'right' : 'left' }" on:click={ skipGroup }>>></span> 
    { /if }

</article>

<style>

    span {
        position: absolute;
        top: 50%;
    }

    .right {
        right: 5%;
    }

    .left {
        left: 5%;
        transform: scale(-1, 1);
    }

    span:hover {
        cursor: pointer;
    }

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