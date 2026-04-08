'use Client';
import { AvatarInfoResp } from '@/api';
import { ComponentVariantsProps } from '@/components/types/component';
import { Img } from '@/components/ui/img';
import { cn } from '@/lib/utils';
import { tv } from 'tailwind-variants';
import AvatarSelectedIcon from './assets/avatar-selected-icon.svg';

/** 可选择的数字人列表 */
function AvatarSelectList({
  className,
  dataSource,
  selected,
  onClickItem,
  ...props
}: React.ComponentProps<'div'> & {
  dataSource?: AvatarInfoResp[];
  selected?: string;
  onClickItem?: (avatar: AvatarInfoResp) => void;
}) {
  return (
    <div className={cn('grid w-full grid-cols-1 gap-10 sm:grid-cols-2', className)} {...props}>
      {dataSource?.map((item) => (
        <AvatarCard
          key={item?.avatarId}
          avatar={item}
          selected={selected === item.avatarId}
          onClick={() => onClickItem?.(item)}
        />
      ))}
    </div>
  );
}

const variant = tv({
  slots: {
    base: 'relative flex cursor-pointer flex-row items-center',
    image:
      'absolute aspect-[3/4] w-[173px] shrink-0 overflow-hidden rounded-[24px] border-4 bg-[#FBFDFE] [&_img]:object-cover [&_img]:object-top',
    content:
      'flex flex-1 transform flex-col overflow-hidden rounded-[24px] bg-[#FBFDFE] p-5 py-5 ps-48.25 pe-5 transition-all',
    title: 'mb-2 w-fit text-lg font-semibold text-[#062936]',
    tagList: 'mb-4 scrollbar-hidden flex flex-row items-center gap-1.5 overflow-x-auto',
    tag: 'inline-flex h-5 items-center justify-center rounded-[4px] bg-[#E1EDF0] px-2 text-xs whitespace-nowrap text-[#386E9D]',
    description: 'mb-4 rounded-[12px] bg-[#ECF3F5] p-2.5 text-xs text-[#0F3F6A] [&_p]:line-clamp-3',
    button: 'w-full',
    selectedIcon: 'absolute end-5 top-5 size-6 rounded-full',
  },
  variants: {
    selected: {
      true: {
        content: 'border-3 border-[#FF7E3E]',
        selectedIcon: 'block',
      },
      false: {
        content: 'border-3 border-white',
        selectedIcon: 'hidden',
      },
    },
  },
  defaultVariants: {
    selected: false,
  },
});

/** 数字人卡片 */
function AvatarCard({
  className,
  classNames,
  avatar,
  selected = false,
  ...props
}: Partial<React.ComponentProps<'div'>> &
  ComponentVariantsProps<typeof variant> & {
    /** 数字人信息 */
    avatar: AvatarInfoResp;
    /** 是否选中 */
    selected?: boolean;
  }) {
  const slots = variant({ selected });

  return (
    <div
      data-slot="avatar-card"
      data-selected={selected}
      className={cn(slots.base({ className: classNames?.base }), className)}
      {...props}
    >
      <AvatarSelectedIcon
        data-slot="avatar-card-selected-icon"
        className={slots.selectedIcon({
          className: classNames?.selectedIcon,
        })}
      />
      <div
        data-slot="avatar-card-image"
        className={slots.image({
          className: classNames?.image,
        })}
      >
        {!avatar?.avatarImageUrl ? null : <Img src={avatar?.avatarImageUrl} fill />}
      </div>
      <div
        data-slot="avatar-card-content"
        className={slots.content({ className: classNames?.content })}
      >
        <div
          data-slot="avatar-card-title"
          className={slots.title({ className: classNames?.title })}
        >
          {avatar?.avatarNickname}
        </div>
        <div
          data-slot="avatar-card-tag-list"
          className={slots.tagList({ className: classNames?.tagList })}
        >
          {avatar?.tagList?.slice(0, 3)?.map((tag) => (
            <span
              data-slot="avatar-card-tag"
              key={tag.tagCode}
              className={slots.tag({ className: classNames?.tag })}
            >
              {tag.tagName}
            </span>
          ))}
        </div>
        <div
          data-slot="avatar-card-description"
          className={slots.description({ className: classNames?.description })}
        >
          <p>{avatar?.selfIntroduction}</p>
        </div>
      </div>
    </div>
  );
}

export { AvatarSelectList };
